import pytest
from app.services.neo4j_service import neo4j_service

@pytest.mark.asyncio
async def test_neo4j_graph_structure_building():
    papers = [
        {
            "paper_id": "openalex:W100",
            "title": "Empirical Detection of Misinformation",
            "authors": ["Alice Smith", "Bob Jones"],
            "year": 2023,
            "source": "OpenAlex",
            "citation_count": 50,
            "doi": "10.1000/100"
        },
        {
            "paper_id": "openalex:W200",
            "title": "Multilingual Limitations Study",
            "authors": ["Charlie Brown"],
            "year": 2023,
            "source": "OpenAlex",
            "citation_count": 20,
            "doi": "10.1000/200"
        }
    ]
    claims = [
        {
            "claim_id": "c100",
            "paper_id": "openalex:W100",
            "statement": "GPT-4 detects misinformation on English benchmark",
            "verification_status": "SUPPORTED",
            "confidence_score": 88.0,
            "evidence_text": "Provenance: [OpenAlex] 88% precision",
            "dataset": "MultiDomain-Bench",
            "methodology": "Zero-shot prompting",
            "results": "88% F1-score"
        },
        {
            "claim_id": "c200",
            "paper_id": "openalex:W200",
            "statement": "LLM misinformation detection fails on low-resource datasets",
            "verification_status": "CONTRADICTED",
            "confidence_score": 45.0,
            "evidence_text": "Provenance: [OpenAlex] Low precision on low-resource tier",
            "dataset": "LowResource-Bench",
            "methodology": "Few-shot prompting",
            "results": "45% F1-score"
        }
    ]
    contradictions = [
        {
            "contradiction_id": "contra_1",
            "claim_a_id": "c100",
            "claim_b_id": "c200",
            "paper_a_id": "openalex:W100",
            "paper_b_id": "openalex:W200",
            "type": "different_populations",
            "description": "Variance across languages"
        }
    ]

    graph = neo4j_service.build_graph_structure(papers, claims, contradictions)
    
    node_labels = {n["label"] for n in graph["nodes"]}
    link_rels = {l["relationship"] for l in graph["links"]}

    assert "Paper" in node_labels
    assert "Author" in node_labels
    assert "Claim" in node_labels
    assert "Evidence" in node_labels
    assert "Dataset" in node_labels
    assert "Method" in node_labels
    assert "Result" in node_labels

    assert "AUTHORED" in link_rels
    assert "CONTAINS_CLAIM" in link_rels
    assert "SUPPORTED_BY" in link_rels
    assert "USES_DATASET" in link_rels
    assert "USES_METHOD" in link_rels
    assert "REPORTS_RESULT" in link_rels
    assert "CONTRADICTS" in link_rels
