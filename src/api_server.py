#!/usr/bin/env python3
"""
HTTP API and static application server for tender document processing.
"""

from __future__ import annotations
import argparse
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
import re
import signal
import sys
import urllib.parse
import uuid
from typing import Any, Dict, List, Optional

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SRC_DIR)
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from pdf_bilingual_ingest import (
    OCRBlock,
    PageIngestionResult,
    ParentChildHierarchicalChunker,
    extract_scanned_jpeg_pages_from_pdf,
    GeminiVisionOCREngine,
)
from hybrid_retriever import AlgerianTenderHybridRetriever
from tender_rag_graph import (
    MithaqTenderLangGraphOrchestrator,
    validate_certificate_expiry,
    validate_bpu_dqe_arithmetic,
    check_cross_tender_resource_overlap,
)
from equipment_workflow_engine import (
    LOT4_TENDER_ITEMS,
    get_full_equipment_workflow_state,
    generate_translated_and_stamped_fiche_pdf,
    compile_ordered_technical_dossier_pdf,
    register_uploaded_fiche_for_item,
)



def load_env() -> None:
    env_path = os.path.join(BASE_DIR, ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env()
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL_NAME = os.environ.get("GEMINI_VISION_OCR_MODEL", "gemini-2.5-flash")
EMBED_MODEL = os.environ.get("GEMINI_EMBEDDING_MODEL", "text-embedding-004")

_default_pdf = os.path.join(BASE_DIR, "CDC EPH MOHAMMADIA.pdf")
if not os.path.exists(_default_pdf):
    _default_pdf = os.path.join(BASE_DIR, "CDC EPH MOHAMMADIA copy.pdf")
CDC_PDF_PATH = os.environ.get("CDC_PDF_PATH", _default_pdf)
if CDC_PDF_PATH and not os.path.isabs(CDC_PDF_PATH):
    CDC_PDF_PATH = os.path.join(BASE_DIR, CDC_PDF_PATH)
if not os.path.exists(CDC_PDF_PATH) and os.path.exists(_default_pdf):
    CDC_PDF_PATH = _default_pdf

PAGES_DIR = os.path.join(SRC_DIR, "extracted_pages")


class MithaqBackendEngine:
    """Stateful backend service managing RAG chunks, audit findings, and resource overlap ledger."""

    def __init__(self) -> None:
        self.ocr_engine = GeminiVisionOCREngine(api_key=API_KEY, model_name=MODEL_NAME)
        self.chunker = ParentChildHierarchicalChunker()
        self.retriever = AlgerianTenderHybridRetriever(api_key=API_KEY, embedding_model=EMBED_MODEL)
        self.orchestrator = MithaqTenderLangGraphOrchestrator(
            api_key=API_KEY, retriever=self.retriever, model_name=MODEL_NAME
        )
        self.audit_log: List[Dict[str, Any]] = []
        self.page_paths: List[str] = []
        self.reconciled_projects: List[str] = []
        self._bootstrap_initial_corpus()

    def _bootstrap_initial_corpus(self) -> None:
        """
        1. Ensures the 28 scanned JPEG pages of `CDC EPH MOHAMMADIA.pdf` are extracted.
        2. Loads the full 28-page bilingual OCR dataset into the Hybrid RRF Retriever.
        """
        if os.path.exists(CDC_PDF_PATH):
            self.page_paths = extract_scanned_jpeg_pages_from_pdf(CDC_PDF_PATH, PAGES_DIR)

        # Load from ground-truth OCR corpus if available
        ocr_path = os.path.join(SRC_DIR, "cdc_eph_mohammadia_ocr.json")
        pages: List[PageIngestionResult] = []

        if os.path.exists(ocr_path):
            try:
                with open(ocr_path, "r", encoding="utf-8") as f:
                    corpus = json.load(f)
                for p in corpus.get("pages", []):
                    blocks = [
                        OCRBlock(
                            text=b.get("text", ""),
                            block_type=b.get("block_type", "CLAUSE"),
                            bbox=b.get("bbox", [0.05, 0.1, 0.95, 0.9]),
                            language=b.get("language", "fr"),
                        )
                        for b in p.get("blocks", [])
                    ]
                    pad = f"{p['page_number']:02d}"
                    pages.append(
                        PageIngestionResult(
                            doc_name="CDC EPH MOHAMMADIA.pdf",
                            page_number=p["page_number"],
                            image_path=f"src/extracted_pages/page_{pad}.jpg",
                            full_markdown=p.get("full_text", ""),
                            has_wet_stamp=p.get("has_wet_stamp", True),
                            has_signature=p.get("has_signature", True),
                            ocr_confidence=p.get("ocr_confidence", 99.0),
                            blocks=blocks,
                        )
                    )
            except Exception as e:
                print(f"[!] Warning reading cdc_eph_mohammadia_ocr.json: {e}")

        # Seed pages if corpus empty
        if not pages:
            pages = [
                PageIngestionResult(
                    doc_name="CDC EPH MOHAMMADIA.pdf",
                    page_number=1,
                    image_path="src/extracted_pages/page_01.jpg",
                    full_markdown="CAHIER DES CHARGES — EPH MOHAMMADIA (Loi 23-12 & Décret 15-247)",
                    has_wet_stamp=True,
                    has_signature=True,
                    ocr_confidence=99.4,
                    blocks=[
                        OCRBlock(
                            text="CAHIER DES CHARGES — EPH MOHAMMADIA (Loi n° 23-12 & Décret 15-247)",
                            block_type="HEADING",
                            bbox=[0.08, 0.06, 0.92, 0.18],
                            language="fr",
                        )
                    ],
                )
            ]

        chunks = self.chunker.build_chunks_from_pages(pages, envelope="CDC")
        self.retriever.index_chunks(chunks)

    def get_overlap_summary(self) -> Dict[str, Any]:
        all_commitments = [
            {"tender_ref": "AOON/11/2025/WILAYA-16", "commitment_state": "AWARDED_ACTIVE", "pledged_headcount": 20},
            {"tender_ref": "CDC-EPH-MOHAMMADIA-2026", "commitment_state": "CURRENT_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/07/2026/ADE-BLIDA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/09/2026/ONA-TIPAZA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/12/2026/DHW-BOUIRA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/15/2026/ANBT-CHLEF", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
        ]
        active_commitments = [
            c for c in all_commitments if c["tender_ref"] not in self.reconciled_projects
        ]
        return check_cross_tender_resource_overlap(
            company_name="SARL Atlas Constructions & Hydraulique",
            nif="001216098442190",
            verified_cnas_engineers=20,
            commitments=active_commitments,
        )


ENGINE = MithaqBackendEngine()


def generate_pdf_audit_report() -> bytes:
    """Generates a formal Pre-Submission Audit Report PDF using PyMuPDF."""
    try:
        import fitz
    except ImportError:
        return b"%PDF-1.4 Empty fallback report"

    doc = fitz.open()
    p1 = doc.new_page(width=595, height=842)
    # Header
    p1.draw_rect(fitz.Rect(30, 25, 565, 80), color=(0.1, 0.15, 0.25), fill=(0.95, 0.97, 1.0), width=1.0)
    p1.insert_text((45, 42), "MITHAQ TENDER AI — RAPPORT D'AUDIT PRÉ-SOUMISSION", fontsize=11, fontname="helv", color=(0.0, 0.3, 0.6))
    p1.insert_text((45, 56), "CONFORME AUX DISPOSITIONS DE LA LOI N° 23-12 ET DU DÉCRET 15-247", fontsize=8.5, fontname="helv", color=(0.3, 0.35, 0.45))
    p1.insert_text((45, 72), f"Tender : AOON/04/2026 · EPH MOHAMMADIA — Date : {datetime.now().strftime('%d/%m/%Y %H:%M')}", fontsize=8.5, fontname="helv")

    y = 105
    p1.insert_text((40, y), "1. IDENTIFICATION DU SOUMISSIONNAIRE & STATUT GLOBAL :", fontsize=10, fontname="helv")
    y += 18
    p1.insert_text((40, y), "• Entreprise : SARL ATLAS CONSTRUCTIONS & HYDRAULIQUE (NIF: 001216098442190)", fontsize=9, fontname="helv")
    y += 16
    p1.insert_text((40, y), "• Statut Global : NON CONFORME AVANT CORRECTION (2 Bloquants Éliminatoires Détectés)", fontsize=9.5, fontname="helv", color=(0.8, 0.1, 0.1))

    y += 30
    p1.insert_text((40, y), "2. SYNTHÈSE DES 3 PLIS RÉGLEMENTAIRES :", fontsize=10, fontname="helv")
    y += 18
    items = [
        ("REQ-CAND-04", "Extrait de Rôle délivré le 02/06/2026 (142 jours > 90 jours)", "BLOQUANT ÉLIMINATOIRE", (0.8, 0.1, 0.1)),
        ("REQ-CAND-07", "Déclaration de Probité : Signature présente, cachet humide manquant", "BLOQUANT ÉLIMINATOIRE", (0.8, 0.1, 0.1)),
        ("REQ-HUM-02", "Moyens Humains : 120 ingénieurs engagés sur 6 marchés vs 20 CNAS (600%)", "ALERTE CHEVAUCHEMENT", (0.8, 0.5, 0.0)),
        ("REQ-FIN-01", "Poste 4.2 BPU (850 000 DZD) vs DQE (805 000 DZD) : Écart 270 000 DZD", "ANOMALIE ARITHMÉTIQUE", (0.8, 0.5, 0.0)),
        ("REQ-TECH-01", "Pompes biomédicales : IP68 et ISO 13485 vérifiés aux fiches constructeur", "CONFORME", (0.1, 0.6, 0.2)),
        ("REQ-CAND-02", "Bilans financiers 2023-2025 certifiés CAC : réguliers et sincères", "CONFORME", (0.1, 0.6, 0.2)),
    ]
    for code, desc, status, col in items:
        p1.insert_text((40, y), f"• [{code}]", fontsize=8.5, fontname="helv")
        p1.insert_text((130, y), desc[:70], fontsize=8.5, fontname="helv")
        p1.insert_text((475, y), status, fontsize=8, fontname="helv", color=col)
        y += 18

    y += 20
    p1.draw_rect(fitz.Rect(40, y, 555, y + 80), color=(0.8, 0.2, 0.2), fill=(1.0, 0.94, 0.94), width=0.8)
    p1.insert_text((50, y + 20), "PLAN D'ACTION CORRECTIF OBLIGATOIRE AVANT SCELLÉ DES PLIS :", fontsize=9, fontname="helv", color=(0.8, 0.1, 0.1))
    p1.insert_text((50, y + 38), "1. Remplacer l'Extrait de Rôle dans le Coffre-Fort par un extrait émis après le 24/07/2026.", fontsize=8.5, fontname="helv")
    p1.insert_text((50, y + 54), "2. Apposer le cachet humide de l'entreprise sur la Déclaration de Probité (page 6).", fontsize=8.5, fontname="helv")
    p1.insert_text((50, y + 70), "3. Aligner le prix unitaire du DQE sur le montant en toutes lettres du BPU (850 000 DZD).", fontsize=8.5, fontname="helv")

    return doc.write()


def generate_pdf_copeo_pv() -> bytes:
    """Generates an official COPEO Evaluation Committee PV PDF."""
    try:
        import fitz
    except ImportError:
        return b"%PDF-1.4 Empty fallback PV"

    doc = fitz.open()
    p1 = doc.new_page(width=595, height=842)
    p1.draw_rect(fitz.Rect(30, 25, 565, 80), color=(0.1, 0.15, 0.25), fill=(0.95, 0.97, 1.0), width=1.0)
    p1.insert_text((45, 42), "RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE", fontsize=10, fontname="helv")
    p1.insert_text((45, 56), "ÉTABLISSEMENT PUBLIC HOSPITALIER DE MOHAMMADIA — COMMISSION COPEO", fontsize=9, fontname="helv", color=(0.0, 0.3, 0.6))
    p1.insert_text((45, 72), "PROCÈS-VERBAL D'OUVERTURE DES PLIS ET D'ÉVALUATION TECHNIQUE (LOI 23-12)", fontsize=8.5, fontname="helv", color=(0.3, 0.35, 0.45))

    y = 110
    p1.insert_text((40, y), "CLASSEMENT TECHNIQUE COMPARATIF DES SOUMISSIONNAIRES :", fontsize=10, fontname="helv")
    y += 20
    bidders = [
        ("1. SPA Cosider Canalisations", "98.0 / 100 pts", "Recevable", "Admis à l'ouverture financière (1er classé)"),
        ("2. EURL HydroTech Algérie", "85.5 / 100 pts", "Recevable", "Admis à l'ouverture financière (2e classé)"),
        ("3. SARL Atlas Constructions", "60.0 / 100 pts", "Conditionnel", "Suspendu : Demande d'éclaircissement CNAS 120/20"),
        ("4. SARL Tell Équipements", "51.0 / 100 pts", "Rejeté", "Éliminé d'office (Note < 60 pts & CACOBATPH manq.)"),
    ]
    for name, score, rec, decision in bidders:
        p1.insert_text((40, y), name, fontsize=9, fontname="helv")
        p1.insert_text((220, y), score, fontsize=9, fontname="helv", color=(0.0, 0.4, 0.8))
        p1.insert_text((310, y), rec, fontsize=8.5, fontname="helv")
        p1.insert_text((390, y), decision[:35], fontsize=8.5, fontname="helv")
        y += 20

    y += 30
    p1.draw_rect(fitz.Rect(40, y, 555, y + 100), color=(0.2, 0.3, 0.4), fill=(0.98, 0.98, 0.98), width=0.8)
    p1.insert_text((50, y + 20), "VISAS ET SIGNATURES DES MEMBRES DE LA COMMISSION COPEO :", fontsize=9, fontname="helv")
    p1.insert_text((50, y + 45), "Le Président de la Commission         Le Représentant de l'EPH         Le Contrôleur Financier", fontsize=8.5, fontname="helv")
    p1.insert_text((50, y + 75), "[Cachet et signature apposés]        [Cachet et signature apposés]   [Cachet et signature apposés]", fontsize=7.5, fontname="helv", color=(0.4, 0.4, 0.4))

    return doc.write()


class MithaqHTTPRequestHandler(SimpleHTTPRequestHandler):
    """HTTP request handler for application routes, static assets, and exports."""

    MAX_BODY_SIZE = 50 * 1024 * 1024  # 50 Megabytes limit

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format: str, *args: Any) -> None:
        pass  # Keep console clean

    def end_headers(self) -> None:
        # Production security headers
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-XSS-Protection", "1; mode=block")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def _send_json(self, payload: Dict[str, Any], status_code: int = 200) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _send_pdf(self, pdf_bytes: bytes, filename: str) -> None:
        safe_filename = re.sub(r'[^A-Za-z0-9_.-]', '_', filename)
        self.send_response(200)
        self.send_header("Content-Type", "application/pdf")
        self.send_header("Content-Disposition", f'attachment; filename="{safe_filename}"')
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(pdf_bytes)))
        self.end_headers()
        self.wfile.write(pdf_bytes)

    def do_OPTIONS(self) -> None:
        self._send_json({"ok": True})

    def do_HEAD(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/v1/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if parsed.path in ("/", ""):
            self.path = "/index.html"
        return super().do_HEAD()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        normalized_path = urllib.parse.unquote(parsed.path)

        # Block path traversal and sensitive files (.env, .git, .agent, etc.)
        path_segments = [seg for seg in normalized_path.split("/") if seg]
        for seg in path_segments:
            if seg.startswith(".") or seg in ("tender", "brain", "__pycache__"):
                self._send_json({"error": "Access Denied: Forbidden resource"}, status_code=403)
                return
        if ".." in normalized_path:
            self._send_json({"error": "Access Denied: Path traversal detected"}, status_code=403)
            return

        # API Routes
        try:
            if parsed.path == "/api/v1/health":
                self._send_json({
                    "status": "online",
                    "vision_ocr_model": MODEL_NAME,
                    "embedding_model": EMBED_MODEL,
                    "extracted_cdc_pages": len(ENGINE.page_paths),
                    "indexed_child_chunks": len(ENGINE.retriever._child_chunks),
                    "indexed_parent_chunks": len(ENGINE.retriever._chunks_by_id) - len(ENGINE.retriever._child_chunks),
                    "audit_log_entries": len(ENGINE.audit_log),
                })
                return

            if parsed.path == "/api/v1/tenders/state":
                self._send_json({
                    "tender_reference": "AOON/04/2026 · CDC EPH MOHAMMADIA",
                    "extracted_pages_count": len(ENGINE.page_paths),
                    "resource_overlap_alert": ENGINE.get_overlap_summary(),
                    "reconciled_projects": ENGINE.reconciled_projects,
                    "audit_log": ENGINE.audit_log[-20:],
                })
                return

            if parsed.path == "/api/v1/export/audit-report":
                pdf_bytes = generate_pdf_audit_report()
                self._send_pdf(pdf_bytes, "Rapport_Audit_Pre_Soumission_Mithaq.pdf")
                return

            if parsed.path == "/api/v1/export/copeo-pv":
                pdf_bytes = generate_pdf_copeo_pv()
                self._send_pdf(pdf_bytes, "Proces_Verbal_Evaluation_COPEO.pdf")
                return

            if parsed.path == "/api/v1/equipment/workflow":
                self._send_json(get_full_equipment_workflow_state())
                return

            if parsed.path == "/api/v1/export/translated-fiche":
                qs = urllib.parse.parse_qs(parsed.query)
                raw_code = qs.get("item", ["LOT 4-12.6"])[0]
                item_code = re.sub(r"[^A-Za-z0-9\s_.-]", "", raw_code).strip()[:40] or "LOT 4-12.6"
                target_code = item_code if item_code in ("LOT 4-03", "LOT 4-04", "LOT 4-06", "LOT 4-12.1", "LOT 4-12.6", "LOT 4-13") else "LOT 4-12.6"
                pdf_bytes = generate_translated_and_stamped_fiche_pdf(target_code)
                safe_name = f"Fiche_Technique_FR_{target_code.replace(' ', '_')}_SARL_FLUIDAL.pdf"
                self._send_pdf(pdf_bytes, safe_name)
                return

            if parsed.path == "/api/v1/export/dossier-technique-lot4":
                pdf_bytes = compile_ordered_technical_dossier_pdf()
                self._send_pdf(pdf_bytes, "Dossier_Technique_Complet_Lot4_SARL_FLUIDAL.pdf")
                return
        except Exception as e:
            self._send_json({"error": "Internal Server Error", "detail": str(e)}, status_code=500)
            return

        # Static assets
        if parsed.path in ("/", ""):
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)

        # Enforce valid Content-Length & max body size
        content_len_header = self.headers.get("Content-Length", "0")
        try:
            content_len = int(content_len_header or "0")
        except (ValueError, TypeError):
            self._send_json({"error": "Invalid Content-Length header"}, status_code=400)
            return

        if content_len < 0:
            self._send_json({"error": "Negative Content-Length header"}, status_code=400)
            return

        if content_len > self.MAX_BODY_SIZE:
            self._send_json(
                {"error": f"Payload too large. Max size is {self.MAX_BODY_SIZE // (1024 * 1024)}MB"},
                status_code=413,
            )
            return

        raw_body = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            if parsed.path == "/api/v1/rag/hybrid-search":
                try:
                    body = json.loads(raw_body.decode("utf-8"))
                except Exception:
                    body = {}
                query = body.get("query", "Quelles sont les pièces éliminatoires et moyens humains ?")
                envelope = body.get("envelope") or None
                top_k = int(body.get("top_k", 4))
                results = ENGINE.retriever.hybrid_search_rrf(
                    query_text=query, target_envelope=envelope, top_k=top_k
                )
                self._send_json({
                    "query": query,
                    "retrieval_method": "Reciprocal Rank Fusion (Dense Vector + Lexical BM25 + Parent Expansion)",
                    "results_count": len(results),
                    "results": results,
                })
                return

            if parsed.path == "/api/v1/audit/decision":
                try:
                    body = json.loads(raw_body.decode("utf-8"))
                except Exception:
                    body = {}
                entry = {
                    "id": str(uuid.uuid4())[:8],
                    "req_code": body.get("req_code", "REQ-CAND-04"),
                    "decision": body.get("decision", "CONFIRMED"),
                    "note": body.get("note", "Validation enregistrée par l'auditeur humain."),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
                ENGINE.audit_log.append(entry)
                self._send_json({"status": "recorded", "entry": entry, "total_logs": len(ENGINE.audit_log)})
                return

            if parsed.path == "/api/v1/overlap/reconcile":
                try:
                    body = json.loads(raw_body.decode("utf-8"))
                except Exception:
                    body = {}
                tender_ref = body.get("tender_ref", "AOON/11/2025/WILAYA-16")
                if tender_ref not in ENGINE.reconciled_projects:
                    ENGINE.reconciled_projects.append(tender_ref)
                ENGINE.audit_log.append({
                    "id": str(uuid.uuid4())[:8],
                    "req_code": "OVERLAP-LEDGER",
                    "decision": "RECONCILED_WITH_PV",
                    "note": f"PV de réception provisoire vérifié pour {tender_ref} (20 ingénieurs libérés).",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                })
                self._send_json({
                    "status": "reconciled",
                    "reconciled_projects": ENGINE.reconciled_projects,
                    "updated_overlap": ENGINE.get_overlap_summary(),
                })
                return

            if parsed.path == "/api/v1/tenders/upload-and-analyze":
                audit_result = ENGINE.orchestrator.run_audit()
                self._send_json({
                    "status": "completed",
                    "document": "CDC EPH MOHAMMADIA.pdf",
                    "total_pages_detected": len(ENGINE.page_paths) or 28,
                    "indexed_child_chunks": len(ENGINE.retriever._child_chunks),
                    "compliance_score": audit_result.get("compliance_score", 30.0),
                    "audit_status": audit_result.get("status", "NON_COMPLIANT_BLOCKERS_PRESENT"),
                    "extrait_de_role_check": validate_certificate_expiry("2026-06-02", "2026-10-22", 90),
                    "bpu_dqe_check": validate_bpu_dqe_arithmetic(850000.0, 805000.0, 6),
                    "overlap_alert": ENGINE.get_overlap_summary(),
                })
                return

            if parsed.path == "/api/v1/equipment/translate-all":
                generated = []
                for code in ["LOT 4-03", "LOT 4-04", "LOT 4-06", "LOT 4-12.1", "LOT 4-12.6"]:
                    generate_translated_and_stamped_fiche_pdf(code)
                    generated.append(code)
                for it in LOT4_TENDER_ITEMS:
                    for c in it["candidates"]:
                        c["needs_translation"] = False
                        c["has_company_branding"] = True
                        c["language"] = "FR (Traduit & Cacheté IA)"
                self._send_json({
                    "status": "all_translated_and_stamped",
                    "generated_french_pdfs": generated,
                    "workflow": get_full_equipment_workflow_state(),
                })
                return

            if parsed.path == "/api/v1/equipment/upload-fiche":
                try:
                    body = json.loads(raw_body.decode("utf-8"))
                except Exception:
                    body = {}
                item_code = body.get("item_code", "LOT 4-13")
                filename = body.get("filename", "Fiche_Fournisseur_Recue.pdf")
                model_name = body.get("model_name", "Mindray WATO EX-65 Pro")
                brand_name = body.get("brand_name", "Mindray Medical International")
                wholesale_dzd = int(body.get("supplier_wholesale_dzd", 3100000))
                margin_pct = int(body.get("resale_margin_pct", 25))
                updated_wf = register_uploaded_fiche_for_item(
                    item_code=item_code,
                    filename=filename,
                    model_name=model_name,
                    brand_name=brand_name,
                    supplier_wholesale_dzd=wholesale_dzd,
                    resale_margin_pct=margin_pct,
                )
                self._send_json({
                    "status": "fiche_uploaded_and_verified",
                    "item_code": item_code,
                    "model_name": model_name,
                    "workflow": updated_wf,
                })
                return

            if parsed.path == "/api/v1/equipment/select-candidate":
                try:
                    body = json.loads(raw_body.decode("utf-8"))
                except Exception:
                    body = {}
                item_code = body.get("item_code", "LOT 4-05")
                model_name = body.get("model", "")
                for it in LOT4_TENDER_ITEMS:
                    if it["item_code"] == item_code:
                        for c in it["candidates"]:
                            c["selection_selected"] = (c["model"] == model_name)
                self._send_json({
                    "status": "candidate_updated",
                    "item_code": item_code,
                    "selected_model": model_name,
                    "workflow": get_full_equipment_workflow_state(),
                })
                return

            self._send_json({"error": f"Unknown endpoint: {parsed.path}"}, status_code=404)
        except Exception as e:
            self._send_json({"error": "Internal Server Error", "detail": str(e)}, status_code=500)


def run_server(port: int = 8000) -> None:
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer(("0.0.0.0", port), MithaqHTTPRequestHandler)

    def handle_shutdown(signum: Any, frame: Any) -> None:
        print(f"\n[+] Graceful shutdown signal received ({signum}). Stopping server...")
        try:
            server.shutdown()
            server.server_close()
        except Exception:
            pass
        sys.exit(0)

    try:
        signal.signal(signal.SIGINT, handle_shutdown)
        signal.signal(signal.SIGTERM, handle_shutdown)
    except Exception:
        pass

    print(f"Mithaq Tender AI Production Server running at http://0.0.0.0:{port} (PID: {os.getpid()})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        handle_shutdown(None, None)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mithaq Tender AI Full-Stack Production Server")
    default_port = int(os.environ.get("PORT", "8000"))
    parser.add_argument("--port", type=int, default=default_port, help=f"Port to bind (default: {default_port})")
    args = parser.parse_args()
    run_server(port=args.port)
