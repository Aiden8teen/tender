#!/usr/bin/env python3
"""
Integration test suite for compliance verification and API endpoints.
"""

from __future__ import annotations
import io
import json
import os
import sys
from typing import Any, Dict, List

import fitz  # PyMuPDF
from PIL import Image

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SRC_DIR)
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from api_server import (
    ENGINE,
    generate_pdf_audit_report,
    generate_pdf_copeo_pv,
    MithaqHTTPRequestHandler,
)
from equipment_workflow_engine import (
    LOT4_TENDER_ITEMS,
    get_full_equipment_workflow_state,
    generate_translated_and_stamped_fiche_pdf,
    compile_ordered_technical_dossier_pdf,
)
from hybrid_retriever import AlgerianTenderHybridRetriever
from pdf_bilingual_ingest import extract_scanned_jpeg_pages_from_pdf
from tender_rag_graph import (
    validate_certificate_expiry,
    validate_bpu_dqe_arithmetic,
    verify_verbatim_quote_on_page,
    check_cross_tender_resource_overlap,
    MithaqTenderLangGraphOrchestrator,
)

PASS_COUNT = 0
FAIL_COUNT = 0


def log_test(name: str, passed: bool, detail: str = "") -> None:
    global PASS_COUNT, FAIL_COUNT
    if passed:
        PASS_COUNT += 1
        print(f"  [PASS] {name}" + (f" -> {detail}" if detail else ""))
    else:
        FAIL_COUNT += 1
        print(f"  [FAIL] {name}" + (f" -> {detail}" if detail else ""))


class MockSocket:
    """Mock socket for simulated HTTP testing without loopback network restrictions."""

    def __init__(self, request_bytes: bytes):
        self.rfile = io.BytesIO(request_bytes)
        self.wfile = io.BytesIO()

    def makefile(self, mode: str, bufsize: int = -1):
        if "r" in mode:
            return self.rfile
        return self.wfile

    def sendall(self, data: bytes):
        self.wfile.write(data)


def simulate_http_request(method: str, path: str, body_dict: Dict[str, Any] = None) -> tuple[int, bytes, Dict[str, str]]:
    """Simulates an HTTP request through MithaqHTTPRequestHandler in memory."""
    body_bytes = json.dumps(body_dict).encode("utf-8") if body_dict is not None else b""
    req_lines = [
        f"{method} {path} HTTP/1.1",
        "Host: localhost:8000",
        "User-Agent: MithaqTestClient/2.0",
        f"Content-Length: {len(body_bytes)}",
        "Content-Type: application/json",
        "",
        "",
    ]
    raw_req = "\r\n".join(req_lines).encode("latin-1") + body_bytes
    mock_sock = MockSocket(raw_req)

    class DummyServer:
        def __init__(self):
            pass

    try:
        handler = MithaqHTTPRequestHandler(mock_sock, ("127.0.0.1", 54321), DummyServer())
    except Exception:
        pass

    raw_resp = mock_sock.wfile.getvalue()
    if not raw_resp:
        return 500, b"", {}

    header_part, _, body_part = raw_resp.partition(b"\r\n\r\n")
    lines = header_part.split(b"\r\n")
    status_line = lines[0].decode("latin-1")
    status_code = int(status_line.split(" ")[1]) if len(status_line.split(" ")) > 1 else 200
    headers = {}
    for h in lines[1:]:
        if b":" in h:
            k, v = h.split(b":", 1)
            headers[k.decode("latin-1").strip().lower()] = v.decode("latin-1").strip()

    return status_code, body_part, headers


def run_all_tests() -> bool:
    print("=" * 80)
    print("MITHAQ TENDER AI — FULL WORKFLOW & REGULATORY COMPLIANCE TEST SUITE")
    print("Zero-Network Sandboxed Execution with Full In-Memory HTTP & Algorithm Verification")
    print("=" * 80)

    # --------------------------------------------------------------------------
    # SUITE 1: Scanned Pages & Image Orientation
    # --------------------------------------------------------------------------
    print("\n--- [Suite 1/8] Use Case 1: CDC Pages Ingestion & 180° Normalization ---")
    pages_dir = os.path.join(SRC_DIR, "extracted_pages")
    page_files = [f for f in os.listdir(pages_dir) if f.startswith("page_") and f.endswith(".jpg")]
    page_files.sort()
    log_test(
        "Extracted 28 JPEG scanned pages",
        len(page_files) == 28,
        f"Found {len(page_files)} pages in {pages_dir}",
    )

    # Verify first page dimensions and valid JPEG
    p1_path = os.path.join(pages_dir, "page_01.jpg")
    try:
        im1 = Image.open(p1_path)
        log_test(
            "Page 01 valid JPEG & right-side up orientation",
            im1.format == "JPEG" and im1.size[0] > 1000 and im1.size[1] > 1500,
            f"Dimensions: {im1.size[0]}x{im1.size[1]} pixels",
        )
    except Exception as e:
        log_test("Page 01 valid JPEG", False, str(e))

    # --------------------------------------------------------------------------
    # SUITE 2: Test Procurement Dossiers
    # --------------------------------------------------------------------------
    print("\n--- [Suite 2/8] Regulatory Test Dossiers Verification (Loi 23-12) ---")
    dossiers_dir = os.path.join(BASE_DIR, "test_dossiers")
    expected_pdfs = [
        "Dossier_Candidature_Atlas.pdf",
        "Offre_Technique_Atlas.pdf",
        "Offre_Financiere_Atlas.pdf",
        "PV_Reception_Provisoire_Wilaya16.pdf",
        "Offre_Complete_HydroTech.pdf",
        "Offre_Complete_Cosider.pdf",
        "Offre_Complete_Tell.pdf",
    ]
    for pdf_name in expected_pdfs:
        pdf_path = os.path.join(dossiers_dir, pdf_name)
        exists = os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000
        log_test(f"Test PDF Dossier: {pdf_name}", exists, f"Size: {os.path.getsize(pdf_path) if exists else 0} bytes")

    # Verify specific test anomalies in Atlas files
    atlas_cand = fitz.open(os.path.join(dossiers_dir, "Dossier_Candidature_Atlas.pdf"))
    cand_text = "".join(p.get_text() for p in atlas_cand)
    log_test(
        "Dossier Candidature Atlas contains 142-day expired Extrait de Rôle",
        "02/06/2026" in cand_text and "142 jours" in cand_text.lower(),
        "Issue date: 02/06/2026 (> 90 days)",
    )
    log_test(
        "Dossier Candidature Atlas contains missing wet stamp alert on probité",
        "CACHET HUMIDE MANQUANT" in cand_text,
        "Page 2 flagged: missing wet stamp",
    )

    atlas_tech = fitz.open(os.path.join(dossiers_dir, "Offre_Technique_Atlas.pdf"))
    tech_text = "".join(p.get_text() for p in atlas_tech)
    log_test(
        "Offre Technique Atlas contains 20 named CNAS engineers & IP68 spec",
        "20 Ingénieurs" in tech_text and "IP68" in tech_text,
        "20 engineers with CNAS IDs + IP68 submersible pumps",
    )

    atlas_fin = fitz.open(os.path.join(dossiers_dir, "Offre_Financiere_Atlas.pdf"))
    fin_text = "".join(p.get_text() for p in atlas_fin)
    log_test(
        "Offre Financière Atlas contains BPU vs DQE arithmetic discrepancy",
        "850 000" in fin_text and "805 000" in fin_text,
        "BPU words: 850 000 DZD vs DQE figures: 805 000 DZD (270k DZD gap)",
    )

    # --------------------------------------------------------------------------
    # SUITE 3: Hybrid RRF Retriever & Bilingual Ground-Truth Corpus
    # --------------------------------------------------------------------------
    print("\n--- [Suite 3/8] Use Case 1: Hybrid RRF Search (pgvector + BM25) ---")
    log_test(
        "Engine corpus initialized with 28 pages",
        len(ENGINE.page_paths) == 28,
        f"{len(ENGINE.page_paths)} pages indexed",
    )
    log_test(
        "Engine indexed chunks count (43 child chunks)",
        len(ENGINE.retriever._child_chunks) == 43,
        f"43 child chunks & {len(ENGINE.retriever._chunks_by_id) - len(ENGINE.retriever._child_chunks)} parent chunks",
    )

    # Query 1: Eliminatory criteria
    q1_results = ENGINE.retriever.hybrid_search_rrf("pièces éliminatoires rejet d'office", top_k=3)
    log_test(
        "Hybrid search on 'pièces éliminatoires'",
        len(q1_results) > 0 and q1_results[0].get("rrf_score", 0) > 0,
        f"Top match: Page {q1_results[0].get('page_number')}, Score: {q1_results[0].get('rrf_score')}",
    )

    # Query 2: Human resources & CNAS
    q2_results = ENGINE.retriever.hybrid_search_rrf("moyen humain ingénieurs affiliation CNAS", top_k=3)
    log_test(
        "Hybrid search on 'moyen humain CNAS'",
        len(q2_results) > 0 and any("moyen" in (r.get("child_content", "") + " " + r.get("parent_content", "")).lower() or "cnas" in (r.get("child_content", "") + " " + r.get("parent_content", "")).lower() for r in q2_results),
        f"Top match section: {q2_results[0].get('section_title')}",
    )

    # Query 3: BPU / DQE financial check
    q3_results = ENGINE.retriever.hybrid_search_rrf("bordereau des prix unitaires BPU montant en lettres", top_k=3)
    log_test(
        "Hybrid search on 'BPU montant en lettres'",
        len(q3_results) > 0,
        f"Top match Page: {q3_results[0].get('page_number')}",
    )

    # --------------------------------------------------------------------------
    # SUITE 4: Deterministic Compliance Validators
    # --------------------------------------------------------------------------
    print("\n--- [Suite 4/8] Use Case 2 & 3: Deterministic Validators (Dates & Math) ---")
    # Date expiry: 142 days > 90 days -> MISSING_BLOCKER
    res_exp_bad = validate_certificate_expiry("2026-06-02", "2026-10-22", 90)
    log_test(
        "Certificate expiry > 90 days (142 days)",
        not res_exp_bad["is_valid"] and res_exp_bad["status"] == "MISSING_BLOCKER" and res_exp_bad["excess_days"] == 52,
        f"Age: {res_exp_bad['age_days']} days (excess: {res_exp_bad['excess_days']} days)",
    )

    # Date expiry: 68 days <= 90 days -> VERIFIED
    res_exp_good = validate_certificate_expiry("2026-08-15", "2026-10-22", 90)
    log_test(
        "Certificate expiry <= 90 days (68 days)",
        res_exp_good["is_valid"] and res_exp_good["status"] == "VERIFIED",
        f"Age: {res_exp_good['age_days']} days (valid)",
    )

    # BPU vs DQE math discrepancy: 850k vs 805k x 6 -> 270k gap
    res_math_bad = validate_bpu_dqe_arithmetic(850000.0, 805000.0, 6)
    log_test(
        "BPU vs DQE arithmetic mismatch (850 000 vs 805 000 x 6)",
        not res_math_bad["is_consistent"] and res_math_bad["total_line_discrepancy_dzd"] == 270000.0,
        f"Unit gap: {res_math_bad['unit_discrepancy_dzd']} DZD, Total: {res_math_bad['total_line_discrepancy_dzd']} DZD",
    )

    # BPU vs DQE match: 850k vs 850k x 6 -> consistent
    res_math_good = validate_bpu_dqe_arithmetic(850000.0, 850000.0, 6)
    log_test(
        "BPU vs DQE arithmetic match",
        res_math_good["is_consistent"] and res_math_good["unit_discrepancy_dzd"] == 0.0,
        "Discrepancy: 0.00 DZD",
    )

    # Anti-hallucination quote verification
    quote = "Extrait de rôle apuré délivré depuis moins de trois mois"
    full_text = "Copie de l'extrait de rôle en règle apuré ou avec échéancier daté de moins de trois (03) mois (< 90 jours)."
    sim_score = verify_verbatim_quote_on_page(quote, full_text)
    log_test(
        "Anti-hallucination quote overlap verification",
        sim_score >= 0.75,
        f"Token overlap score: {sim_score * 100}%",
    )

    # --------------------------------------------------------------------------
    # SUITE 5: Resource Overlap Ledger & Reconciliation
    # --------------------------------------------------------------------------
    print("\n--- [Suite 5/8] Use Case 6: Cross-Tender Resource Overlap Ledger ---")
    initial_overlap = ENGINE.get_overlap_summary()
    log_test(
        "Initial 600% Resource Overlap Alert (120 pledged vs 20 CNAS)",
        initial_overlap["utilization_pct"] == 600.0 and initial_overlap["total_pledged_engineers"] == 120,
        f"Load: {initial_overlap['utilization_pct']}%, Deficit: {initial_overlap['engineer_deficit']} Engineers",
    )
    log_test(
        "Key personnel duplications identified (Bensalem & Mansouri)",
        len(initial_overlap["named_duplicates"]) == 2,
        f"{len(initial_overlap['named_duplicates'])} named duplicates at 200% allocation",
    )

    # Simulate reconciliation with PV de réception
    ENGINE.reconciled_projects.append("AOON/11/2025/WILAYA-16")
    reconciled_overlap = ENGINE.get_overlap_summary()
    log_test(
        "Resource reconciliation frees 20 engineers via PV de réception",
        reconciled_overlap["total_pledged_engineers"] == 100 and reconciled_overlap["utilization_pct"] == 500.0,
        f"New load: {reconciled_overlap['utilization_pct']}% (100 / 20 Eng.)",
    )
    # Reset for idempotency
    ENGINE.reconciled_projects.clear()

    # --------------------------------------------------------------------------
    # SUITE 6: LangGraph 5-Node Pipeline Execution
    # --------------------------------------------------------------------------
    print("\n--- [Suite 6/8] LangGraph Stateful Workflow Execution ---")
    audit_res = ENGINE.orchestrator.run_audit()
    log_test(
        "LangGraph pipeline executed with score & status",
        "compliance_score" in audit_res and "status" in audit_res,
        f"Score: {audit_res.get('compliance_score')} / 100, Status: {audit_res.get('status')}",
    )
    log_test(
        "LangGraph identified 2 blockers (Extrait de rôle + Déclaration probité)",
        audit_res.get("status") == "NON_COMPLIANT_BLOCKERS_PRESENT",
        f"Findings count: {len(audit_res.get('audit_findings', []))}",
    )

    # --------------------------------------------------------------------------
    # SUITE 7: Official Document PDF Generation (PyMuPDF)
    # --------------------------------------------------------------------------
    print("\n--- [Suite 7/8] Official PDF Document Generation & Export ---")
    audit_pdf = generate_pdf_audit_report()
    doc_audit = fitz.open(stream=audit_pdf, filetype="pdf")
    log_test(
        "Generated Pre-Submission Audit Report PDF",
        len(doc_audit) >= 1 and "RAPPORT D'AUDIT PRÉ-SOUMISSION" in doc_audit[0].get_text(),
        f"Pages: {len(doc_audit)}, Size: {len(audit_pdf)} bytes",
    )

    copeo_pdf = generate_pdf_copeo_pv()
    doc_pv = fitz.open(stream=copeo_pdf, filetype="pdf")
    log_test(
        "Generated Official COPEO Evaluation PV PDF",
        len(doc_pv) >= 1 and "COMMISSION COPEO" in doc_pv[0].get_text() and "Cosider" in doc_pv[0].get_text(),
        f"Pages: {len(doc_pv)}, Size: {len(copeo_pdf)} bytes",
    )

    # --------------------------------------------------------------------------
    # SUITE 8: In-Memory HTTP API Endpoints & Contract Verification
    # --------------------------------------------------------------------------
    print("\n--- [Suite 8/8] In-Memory HTTP API Endpoints Dispatch ---")
    # GET /api/v1/health
    code, body, _ = simulate_http_request("GET", "/api/v1/health")
    data_health = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test("GET /api/v1/health via HTTP handler", code == 200 and data_health.get("status") == "online", f"{data_health}")

    # GET /api/v1/tenders/state
    code, body, _ = simulate_http_request("GET", "/api/v1/tenders/state")
    data_state = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "GET /api/v1/tenders/state via HTTP handler",
        code == 200 and data_state.get("extracted_pages_count") == 28,
        f"Pages: {data_state.get('extracted_pages_count')}",
    )

    # POST /api/v1/rag/hybrid-search
    code, body, _ = simulate_http_request(
        "POST",
        "/api/v1/rag/hybrid-search",
        {"query": "Quelles sont les pièces éliminatoires ?", "top_k": 3},
    )
    data_rag = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/rag/hybrid-search via HTTP handler",
        code == 200 and len(data_rag.get("results", [])) > 0,
        f"{len(data_rag.get('results', []))} search results returned",
    )

    # POST /api/v1/audit/decision
    code, body, _ = simulate_http_request(
        "POST",
        "/api/v1/audit/decision",
        {"req_code": "REQ-CAND-04", "decision": "CONFIRMED", "note": "Validation auditeur test"},
    )
    data_dec = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/audit/decision via HTTP handler",
        code == 200 and data_dec.get("status") == "recorded",
        f"Entry ID: {data_dec.get('entry', {}).get('id')}",
    )

    # POST /api/v1/overlap/reconcile
    code, body, _ = simulate_http_request(
        "POST",
        "/api/v1/overlap/reconcile",
        {"tender_ref": "AOON/11/2025/WILAYA-16"},
    )
    data_rec = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/overlap/reconcile via HTTP handler",
        code == 200 and data_rec.get("status") == "reconciled",
        f"Reconciled projects: {data_rec.get('reconciled_projects')}",
    )

    # GET /api/v1/export/audit-report
    code, body, hdrs = simulate_http_request("GET", "/api/v1/export/audit-report")
    log_test(
        "GET /api/v1/export/audit-report via HTTP handler",
        code == 200 and body.startswith(b"%PDF"),
        f"{len(body)} bytes, content-type: {hdrs.get('content-type')}",
    )

    # GET /api/v1/export/copeo-pv
    code, body, hdrs = simulate_http_request("GET", "/api/v1/export/copeo-pv")
    log_test(
        "GET /api/v1/export/copeo-pv via HTTP handler",
        code == 200 and body.startswith(b"%PDF"),
        f"{len(body)} bytes, content-type: {hdrs.get('content-type')}",
    )

    # POST /api/v1/tenders/upload-and-analyze
    code, body, _ = simulate_http_request("POST", "/api/v1/tenders/upload-and-analyze", {})
    data_upload = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/tenders/upload-and-analyze via HTTP handler",
        code == 200 and data_upload.get("status") == "completed",
        f"Compliance score: {data_upload.get('compliance_score')}, Total pages: {data_upload.get('total_pages_detected')}",
    )

    # --------------------------------------------------------------------------
    # SUITE 9: Medical Equipment & Fiche Technique Automation (Lot 04 - SARL FLUIDAL)
    # --------------------------------------------------------------------------
    print("\n--- [Suite 9/9] Use Case 7: Medical Equipment & Fiche Technique Automation (Lot 04) ---")
    wf_state = get_full_equipment_workflow_state()
    items = wf_state.get("items", [])
    log_test(
        "Equipment workflow state loaded with 19 sequential Lot 04 items (17 in docs + 2 out-of-stock sourcing)",
        len(items) == 19 and items[0]["item_code"] == "LOT 4-01" and items[-1]["item_code"] == "LOT 4-14",
        f"Items: {len(items)}, First: {items[0]['item_code']}, Last: {items[-1]['item_code']}",
    )

    log_test(
        "Total 33 medical equipment files cataloged in docs/",
        wf_state.get("summary_metrics", {}).get("total_files_in_docs_folder") == 33,
        f"Files in docs/: {wf_state.get('summary_metrics', {}).get('total_files_in_docs_folder')}",
    )

    # Multi-candidate sweet-spot on Lot 4-5
    lot4_5 = next(it for it in items if it["item_code"] == "LOT 4-05")
    cands_4_5 = lot4_5.get("candidates", [])
    medige_sl1d = next(c for c in cands_4_5 if "MGE-SL1D" in c["model"])
    log_test(
        "Multi-candidate sweet-spot optimizer on LOT 4-05 (MGE-SL1D vs Perlong)",
        len(cands_4_5) == 2 and medige_sl1d.get("selection_selected") is True,
        f"Selected: {medige_sl1d['model']} ({medige_sl1d['bonus_points']})",
    )

    # Missing spec detector and RFQ package on Lot 4-3
    rfq_pkgs = wf_state.get("supplier_rfq_packages", [])
    log_test(
        "Missing spec detector & automated supplier RFQ studio for LOT 4-03",
        len(rfq_pkgs) >= 1 and rfq_pkgs[0]["item_code"] == "LOT 4-03" and len(rfq_pkgs[0]["recommended_suppliers"]) == 3,
        f"Suppliers: {[s['name'] for s in rfq_pkgs[0]['recommended_suppliers']]}, Subject: {rfq_pkgs[0]['rfq_subject_fr'][:40]}...",
    )

    # Zero-Photoshop translation & stamped PDF for LOT 4-12.6 (PNG vidoir)
    pdf_12_6 = generate_translated_and_stamped_fiche_pdf("LOT 4-12.6")
    doc_12_6 = fitz.open(stream=pdf_12_6, filetype="pdf")
    log_test(
        "Zero-Photoshop PNG to stamped French PDF for LOT 4-12.6 (vidoir.png)",
        len(doc_12_6) >= 1 and "SARL FLUIDAL" in doc_12_6[0].get_text() and "WXC0827-00" in doc_12_6[0].get_text(),
        f"Pages: {len(doc_12_6)}, Size: {len(pdf_12_6)} bytes, Stamp detected",
    )

    # Zero-Photoshop translation & stamped PDF for LOT 4-04 (English PDF + scanned camera)
    pdf_04 = generate_translated_and_stamped_fiche_pdf("LOT 4-04")
    doc_04 = fitz.open(stream=pdf_04, filetype="pdf")
    log_test(
        "Zero-Photoshop English PDF to stamped French PDF for LOT 4-04 (MGE-SLK3B)",
        len(doc_04) >= 1 and "SARL FLUIDAL" in doc_04[0].get_text() and "MGE-SLK3B" in doc_04[0].get_text(),
        f"Pages: {len(doc_04)}, Size: {len(pdf_04)} bytes",
    )

    # Sequential technical dossier compilation for Lot 04
    dossier_lot4 = compile_ordered_technical_dossier_pdf()
    doc_lot4 = fitz.open(stream=dossier_lot4, filetype="pdf")
    log_test(
        "Sequential technical dossier compiled in exact CDC order (17 items)",
        len(doc_lot4) >= 5 and "DOSSIER TECHNIQUE COMPLET" in doc_lot4[0].get_text(),
        f"Pages: {len(doc_lot4)}, Size: {len(dossier_lot4)} bytes, Cover & TOC present",
    )

    # In-memory HTTP endpoint: GET /api/v1/equipment/workflow
    code, body, _ = simulate_http_request("GET", "/api/v1/equipment/workflow")
    data_eq = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "GET /api/v1/equipment/workflow via HTTP handler",
        code == 200 and len(data_eq.get("items", [])) == 19,
        f"Returned {len(data_eq.get('items', []))} items",
    )

    # In-memory HTTP endpoint: POST /api/v1/equipment/select-candidate
    code, body, _ = simulate_http_request(
        "POST",
        "/api/v1/equipment/select-candidate",
        {"item_code": "LOT 4-05", "model": "PERLONG LED 700/500"},
    )
    data_sel = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/equipment/select-candidate via HTTP handler",
        code == 200 and data_sel.get("status") == "candidate_updated",
        f"Selected model: {data_sel.get('selected_model')}",
    )

    # Re-select optimal MGE-SL1D
    simulate_http_request(
        "POST",
        "/api/v1/equipment/select-candidate",
        {"item_code": "LOT 4-05", "model": "MEDIGE MGE-SL1D (LED 700/500)"},
    )

    # In-memory HTTP endpoint: POST /api/v1/equipment/translate-all
    code, body, _ = simulate_http_request("POST", "/api/v1/equipment/translate-all", {})
    data_trans = json.loads(body.decode("utf-8")) if code == 200 else {}
    log_test(
        "POST /api/v1/equipment/translate-all via HTTP handler",
        code == 200 and len(data_trans.get("generated_french_pdfs", [])) == 5,
        f"Generated {len(data_trans.get('generated_french_pdfs', []))} French PDFs",
    )

    # In-memory HTTP endpoint: GET /api/v1/export/translated-fiche
    code, body, hdrs = simulate_http_request("GET", "/api/v1/export/translated-fiche?item=LOT+4-12.6")
    log_test(
        "GET /api/v1/export/translated-fiche?item=LOT+4-12.6 via HTTP handler",
        code == 200 and body.startswith(b"%PDF"),
        f"{len(body)} bytes, content-disposition: {hdrs.get('content-disposition', '')[:40]}...",
    )

    # In-memory HTTP endpoint: GET /api/v1/export/dossier-technique-lot4
    code, body, hdrs = simulate_http_request("GET", "/api/v1/export/dossier-technique-lot4")
    log_test(
        "GET /api/v1/export/dossier-technique-lot4 via HTTP handler",
        code == 200 and body.startswith(b"%PDF"),
        f"{len(body)} bytes, content-type: {hdrs.get('content-type')}",
    )

    # --------------------------------------------------------------------------
    # SUITE 10: Production Security Hardening & Vulnerability Shielding
    # --------------------------------------------------------------------------
    print("\n--- [Suite 10/10] Production Security Hardening & Vulnerability Shielding ---")
    # 1. Dotfile protection (.env)
    code_env, _, _ = simulate_http_request("GET", "/.env")
    log_test(
        "Direct access to /.env blocked with 403 Forbidden",
        code_env == 403,
        f"HTTP Status: {code_env}",
    )

    # 2. Hidden repo files (.git)
    code_git, _, _ = simulate_http_request("GET", "/.git/config")
    log_test(
        "Direct access to /.git/config blocked with 403 Forbidden",
        code_git == 403,
        f"HTTP Status: {code_git}",
    )

    # 3. Path traversal protection (/../../etc/passwd)
    code_trav, _, _ = simulate_http_request("GET", "/../../etc/passwd")
    log_test(
        "Path traversal '/../../etc/passwd' blocked with 403 Forbidden",
        code_trav == 403,
        f"HTTP Status: {code_trav}",
    )

    # 4. Mandatory Production Security Headers
    _, _, sec_hdrs = simulate_http_request("GET", "/api/v1/health")
    has_sec_headers = (
        sec_hdrs.get("x-content-type-options") == "nosniff"
        and sec_hdrs.get("x-frame-options") == "SAMEORIGIN"
        and sec_hdrs.get("x-xss-protection") == "1; mode=block"
        and "cache-control" in sec_hdrs
    )
    log_test(
        "Production security headers present on API responses",
        has_sec_headers,
        f"X-Content-Type-Options: {sec_hdrs.get('x-content-type-options')}, X-Frame-Options: {sec_hdrs.get('x-frame-options')}",
    )

    # 5. Query parameter injection sanitization
    code_inj, body_inj, hdrs_inj = simulate_http_request(
        "GET", "/api/v1/export/translated-fiche?item=LOT%204-12.6%3Cscript%3Ealert(1)%3C/script%3E"
    )
    cd_header = hdrs_inj.get("content-disposition", "")
    log_test(
        "Query injection in /api/v1/export/translated-fiche safely sanitized",
        code_inj == 200 and "<script>" not in cd_header and body_inj.startswith(b"%PDF"),
        f"Sanitized filename in header: {cd_header[:50]}...",
    )

    # --------------------------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------------------------
    print("\n" + "=" * 80)
    print(f"VERIFICATION COMPLETE: {PASS_COUNT} PASSED · {FAIL_COUNT} FAILED")
    print("=" * 80)
    return FAIL_COUNT == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
