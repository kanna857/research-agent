import pytest
from app.schemas.paper import PaperResponse
from app.agents.extractor import extractor_agent
from app.services.document_processor import document_processor

@pytest.mark.asyncio
async def test_document_processor_chunking_and_provenance():
    text = "Large language models have shown remarkable capabilities in text classification. However, evaluating misinformation detection across multiple languages remains challenging. Recent empirical studies demonstrate significant performance drops on low-resource datasets."
    chunks = document_processor.chunk_text(text, max_words=15)
    assert len(chunks) >= 2

    provenance = document_processor.build_provenance(
        source="OpenAlex",
        title="Test Misinformation Paper",
        doi="10.1000/test.123",
        chunk_index=0
    )
    assert "OpenAlex" in provenance
    assert "Test Misinformation Paper" in provenance
    assert "10.1000/test.123" in provenance

@pytest.mark.asyncio
async def test_evidence_extraction_agent():
    paper = PaperResponse(
        id="paper_1",
        paper_id="openalex:W100",
        title="Empirical Misinformation Detection using LLMs",
        authors=["Alice Smith", "Bob Jones"],
        year=2023,
        abstract="We evaluate GPT-4 and open source LLMs on multilingual misinformation detection. Results show 85% F1-score on English but only 52% on low-resource languages.",
        doi="https://doi.org/10.1000/misinfo.2023",
        url="https://doi.org/10.1000/misinfo.2023",
        source="OpenAlex",
        citation_count=42
    )

    claims = await extractor_agent.extract_claims([paper], query="Can LLMs detect misinformation?")
    assert len(claims) > 0
    c = claims[0]
    assert c.paper_id == "openalex:W100"
    assert c.evidence_text
    assert "Provenance:" in c.evidence_text
