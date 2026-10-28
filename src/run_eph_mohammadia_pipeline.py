#!/usr/bin/env python3
"""
MITHAQ TENDER AI — END-TO-END RAG & LANGGRAPH RUNNER FOR `CDC EPH MOHAMMADIA copy.pdf`
======================================================================================
Run from your terminal:
    python3 src/run_eph_mohammadia_pipeline.py --max-pages 5

What this script does step-by-step:
1. Extracts all 28 scanned JPEG pages (1248x1760) from `CDC EPH MOHAMMADIA copy.pdf`
   into `src/extracted_pages/page_01.jpg` .. `page_28.jpg`.
2. Calls `gemini-2.5-flash` Vision-OCR on each page to extract French & Arabic text,
   Markdown tables, wet-stamp/signature flags, and [x0, y0, x1, y1] bounding boxes.
3. Builds Parent-Child hierarchical chunks (`ParentChildHierarchicalChunker`).
4. Indexes chunks into `AlgerianTenderHybridRetriever` (`text-embedding-004` + lexical BM25 RRF).
5. Runs the LangGraph CDC Requirement Extractor + Deterministic Pre-Submission Validators
   + Cross-Tender Resource Overlap Check (20 CNAS engineers vs. 120 pledged across 6 projects).
6. Saves the complete JSON output to `src/eph_mohammadia_rag_output.json`.
"""

import argparse
from dataclasses import asdict
import json
import os
import sys

from pdf_bilingual_ingest import (
    extract_scanned_jpeg_pages_from_pdf,
    GeminiVisionOCREngine,
    ParentChildHierarchicalChunker,
)
from hybrid_retriever import AlgerianTenderHybridRetriever
from tender_rag_graph import (
    MithaqTenderLangGraphOrchestrator,
    validate_certificate_expiry,
    validate_bpu_dqe_arithmetic,
    check_cross_tender_resource_overlap,
)


def load_env_file(env_path: str) -> None:
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Mithaq RAG & LangGraph Pipeline on CDC EPH Mohammadia")
    parser.add_argument(
        "--pdf",
        default="/Users/apple/Development/opencode/tender/CDC EPH MOHAMMADIA.pdf",
        help="Path to the Cahier des Charges PDF",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=5,
        help="Number of scanned pages to OCR via Gemini 2.5 Flash in this test run (set to 28 for full doc)",
    )
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    load_env_file(os.path.join(base_dir, ".env"))

    api_key = os.environ.get("GEMINI_API_KEY", "")
    ocr_model = os.environ.get("GEMINI_VISION_OCR_MODEL", "gemini-2.5-flash")
    pages_dir = os.path.join(base_dir, "src", "extracted_pages")

    print("=" * 80)
    print("MITHAQ TENDER AI — BILINGUAL RAG & LANGGRAPH PIPELINE")
    print(f"Target PDF : {args.pdf}")
    print(f"OCR Model  : {ocr_model} (High-Throughput Multimodal JSON Mode)")
    print("=" * 80)

    # Step 1: Extract scanned JPEG pages from PDF
    page_paths = extract_scanned_jpeg_pages_from_pdf(args.pdf, pages_dir)
    print(f"[Step 1/5] Extracted {len(page_paths)} scanned page images (1248x1760 JPEG) to: {pages_dir}")

    # Step 2: Run Gemini 2.5 Flash Vision-OCR on selected pages
    ocr_engine = GeminiVisionOCREngine(api_key=api_key, model_name=ocr_model)
    chunker = ParentChildHierarchicalChunker()
    retriever = AlgerianTenderHybridRetriever(api_key=api_key)
    orchestrator = MithaqTenderLangGraphOrchestrator(api_key=api_key, retriever=retriever, model_name=ocr_model)

    ingested_pages = []
    extracted_requirements = []

    target_paths = page_paths[: max(1, min(args.max_pages, len(page_paths)))]
    print(f"[Step 2/5] Running Gemini 2.5 Flash Vision-OCR & Layout Analysis on {len(target_paths)} page(s)...")

    for idx, img_path in enumerate(target_paths, start=1):
        try:
            page_res = ocr_engine.ocr_page_image(
                image_path=img_path,
                doc_name=os.path.basename(args.pdf),
                page_number=idx,
            )
            ingested_pages.append(page_res)
            print(
                f"  -> Page {idx:02d}: extracted {len(page_res.blocks)} layout blocks "
                f"(Wet Stamp={page_res.has_wet_stamp}, Signature={page_res.has_signature})"
            )
            reqs = orchestrator.extract_requirements_from_cdc_section(
                doc_name=os.path.basename(args.pdf),
                page_number=idx,
                page_markdown=page_res.full_markdown,
            )
            if reqs:
                extracted_requirements.extend(reqs)
                print(f"     Extracted {len(reqs)} structured procurement requirement(s) from Page {idx:02d}")
        except Exception as err:
            print(f"  [!] Note on Page {idx:02d} live API call: {err}")
            break

    # Step 3: Build Parent-Child Chunks & Index in Hybrid RRF Retriever
    chunks = chunker.build_chunks_from_pages(ingested_pages, envelope="CDC")
    indexed_count = retriever.index_chunks(chunks)
    print(f"[Step 3/5] Built {len(chunks)} Parent-Child chunks ({indexed_count} Child chunks indexed for Hybrid RRF).")

    # Step 4: Run Deterministic Audit Validators (Dates, BPU/DQE Math, Cross-Tender Resource Overlap)
    print("[Step 4/5] Running Deterministic LangGraph Tool Validators...")
    extrait_role_check = validate_certificate_expiry(
        issue_date_iso="2026-06-02",
        tender_opening_date_iso="2026-10-22",
        max_age_days=90,
    )
    bpu_dqe_check = validate_bpu_dqe_arithmetic(
        bpu_price_in_words_numeric=850000.0,
        dqe_unit_price_numeric=805000.0,
        quantity=6,
    )
    overlap_alert = check_cross_tender_resource_overlap(
        company_name="SARL Atlas Constructions & Hydraulique",
        nif="001216098442190",
        verified_cnas_engineers=20,
        commitments=[
            {"tender_ref": "AOON/11/2025/WILAYA-16", "commitment_state": "AWARDED_ACTIVE", "pledged_headcount": 20},
            {"tender_ref": "CDC-EPH-MOHAMMADIA-2026", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/07/2026/ADE-BLIDA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/09/2026/ONA-TIPAZA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/12/2026/DHW-BOUIRA", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
            {"tender_ref": "AOON/15/2026/ANBT-CHLEF", "commitment_state": "PROPOSED_IN_BID", "pledged_headcount": 20},
        ],
    )

    output_path = os.path.join(base_dir, "src", "eph_mohammadia_rag_output.json")
    report = {
        "document_name": os.path.basename(args.pdf),
        "total_scanned_pages_extracted": len(page_paths),
        "extracted_pages_directory": pages_dir,
        "pages_ocred_in_run": [asdict(p) for p in ingested_pages],
        "extracted_cdc_requirements": extracted_requirements,
        "deterministic_validators_demo": {
            "extrait_de_role_validity": extrait_role_check,
            "bpu_dqe_arithmetic_check": bpu_dqe_check,
            "cross_tender_resource_overlap_alert": overlap_alert,
        },
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"[Step 5/5] Saved complete RAG & LangGraph audit report to: {output_path}")
    print(
        f"  -> Resource Overlap Engine: {overlap_alert['total_pledged_engineers']} engineers pledged "
        f"across {overlap_alert['overlapping_projects_count']} projects vs. "
        f"{overlap_alert['verified_cnas_engineers']} CNAS verified ({overlap_alert['utilization_pct']}% load)"
    )


if __name__ == "__main__":
    main()
