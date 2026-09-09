import pytest
from app.services.qdrant_service import qdrant_service

@pytest.mark.asyncio
async def test_qdrant_evidence_vectors():
    claims_payload = [
        {
            "claim_id": "c_vector_1",
            "paper_id": "openalex:W200",
            "statement": "Large language models detect online misinformation",
            "evidence_text": "Empirical evaluation on multi-domain dataset shows 82% F1 score.",
            "verification_status": "SUPPORTED",
            "confidence_score": 88.0,
            "explanation": "Verified evidence"
        }
    ]

    count = await qdrant_service.upsert_evidence(claims_payload)
    assert count == 1

    # Test semantic vector search
    search_hits = await qdrant_service.search_evidence("misinformation detection language models", top_k=1)
    assert len(search_hits) == 1
    hit = search_hits[0]
    assert hit["claim_id"] == "c_vector_1"
    assert "misinformation" in hit["statement"].lower()
