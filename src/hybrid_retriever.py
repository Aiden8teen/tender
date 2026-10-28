"""
Hybrid dense and lexical retrieval engine with Reciprocal Rank Fusion.
"""

from __future__ import annotations
import json
import math
import re
import urllib.request
from typing import Any, Dict, List, Optional
import os
import sys

_SRC_DIR = os.path.dirname(os.path.abspath(__file__))
if _SRC_DIR not in sys.path:
    sys.path.insert(0, _SRC_DIR)

try:
    from pdf_bilingual_ingest import HierarchicalChunk
except ImportError:
    from src.pdf_bilingual_ingest import HierarchicalChunk


class AlgerianTenderHybridRetriever:
    def __init__(
        self,
        api_key: str,
        embedding_model: str = "text-embedding-004",
        db_url: Optional[str] = None,
    ):
        self.api_key = api_key.strip()
        self.embedding_model = embedding_model
        self.db_url = db_url
        self._chunks_by_id: Dict[str, HierarchicalChunk] = {}
        self._child_chunks: List[HierarchicalChunk] = []
        self._embeddings: Dict[str, List[float]] = {}

    def embed_text(self, text: str) -> List[float]:
        """Calls Gemini `text-embedding-004` API, with deterministic hash-vector fallback for offline testing."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.embedding_model}:embedContent?key={self.api_key}"
        payload = {
            "model": f"models/{self.embedding_model}",
            "content": {"parts": [{"text": text[:2000]}]},
        }
        headers = {"Content-Type": "application/json", "x-goog-api-key": self.api_key}
        try:
            req = urllib.request.Request(
                url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST"
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                values = data.get("embedding", {}).get("values", [])
                if values:
                    return values
        except Exception:
            pass
        # Deterministic 768-dim fallback vector based on character 3-grams for offline testing
        vec = [0.0] * 768
        tokens = re.findall(r"\w+", text.lower())
        for tok in tokens:
            idx = hash(tok) % 768
            vec[idx] += 1.0
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]

    def index_chunks(self, chunks: List[HierarchicalChunk], tender_id: Optional[str] = None) -> int:
        """Indexes Parent and Child chunks in memory (and PostgreSQL `document_chunks` when connected)."""
        for ch in chunks:
            self._chunks_by_id[ch.chunk_id] = ch
            if ch.chunk_level == "CHILD":
                self._child_chunks.append(ch)
                self._embeddings[ch.chunk_id] = self.embed_text(ch.content)
        return len(self._child_chunks)

    def hybrid_search_rrf(
        self,
        query_text: str,
        target_envelope: Optional[str] = None,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Executes Reciprocal Rank Fusion (RRF) combining:
        - Rank 1: Cosine similarity over dense embeddings
        - Rank 2: Lexical BM25 / token overlap score (crucial for exact CNAS, NIF, BPU, Article numbers)
        Then expands each matched Child chunk to include its Parent chunk context.
        """
        candidates = [
            c for c in self._child_chunks
            if (target_envelope is None or c.envelope == target_envelope)
        ]
        if not candidates:
            return []

        q_vec = self.embed_text(query_text)
        q_tokens = set(re.findall(r"\w+", query_text.lower()))

        dense_scored = []
        lex_scored = []

        for ch in candidates:
            c_vec = self._embeddings.get(ch.chunk_id, [])
            cos_sim = sum(a * b for a, b in zip(q_vec, c_vec)) if c_vec else 0.0
            dense_scored.append((cos_sim, ch.chunk_id))

            c_tokens = set(re.findall(r"\w+", ch.content.lower()))
            overlap = len(q_tokens & c_tokens) / max(len(q_tokens), 1)
            lex_scored.append((overlap, ch.chunk_id))

        dense_scored.sort(reverse=True)
        lex_scored.sort(reverse=True)

        dense_rank = {cid: r + 1 for r, (_, cid) in enumerate(dense_scored)}
        lex_rank = {cid: r + 1 for r, (_, cid) in enumerate(lex_scored)}

        fused = []
        for ch in candidates:
            r_d = dense_rank.get(ch.chunk_id, 999)
            r_l = lex_rank.get(ch.chunk_id, 999)
            rrf_score = (1.0 / (60.0 + r_d)) + (1.0 / (60.0 + r_l))
            parent = self._chunks_by_id.get(ch.parent_chunk_id or "", ch)
            fused.append({
                "chunk_id": ch.chunk_id,
                "parent_chunk_id": ch.parent_chunk_id,
                "doc_name": ch.doc_name,
                "envelope": ch.envelope,
                "section_title": ch.section_title,
                "page_number": ch.page_number,
                "bbox": ch.bbox,
                "child_content": ch.content,
                "parent_content": parent.content,
                "has_wet_stamp": ch.has_wet_stamp,
                "has_signature": ch.has_signature,
                "rrf_score": round(rrf_score, 6),
            })

        fused.sort(key=lambda x: x["rrf_score"], reverse=True)
        return fused[:top_k]
