import pytest
from app.agents.retriever import retriever_agent
from app.schemas.paper import PaperCreate

@pytest.mark.asyncio
async def test_academic_retriever_deduplication():
    # Test DOI and title normalization deduplication
    p1 = PaperCreate(
        paper_id="openalex:1",
        title="Detecting Misinformation with LLMs",
        authors=["Alice"],
        year=2023,
        doi="https://doi.org/10.1234/test.5678",
        url="https://doi.org/10.1234/test.5678",
        source="OpenAlex",
        citation_count=50
    )
    p2 = PaperCreate(
        paper_id="s2:2",
        title="Detecting Misinformation with LLMs",
        authors=["Alice"],
        year=2023,
        doi="10.1234/TEST.5678",
        url="https://semanticscholar.org/paper/2",
        source="Semantic Scholar",
        citation_count=45
    )
    
    # Test normalization helper functions
    norm_doi_1 = retriever_agent._normalize_doi(p1.doi)
    norm_doi_2 = retriever_agent._normalize_doi(p2.doi)
    assert norm_doi_1 == norm_doi_2 == "10.1234/test.5678"

    norm_title_1 = retriever_agent._normalize_title(p1.title)
    norm_title_2 = retriever_agent._normalize_title(p2.title)
    assert norm_title_1 == norm_title_2

@pytest.mark.asyncio
async def test_retriever_live_search():
    queries = ["misinformation detection large language models", "multilingual misinformation LLM"]
    papers = await retriever_agent.retrieve_and_normalize(queries, max_papers=6)
    
    assert isinstance(papers, list)
    assert len(papers) > 0
    first_paper = papers[0]
    assert first_paper.title
    assert first_paper.source in ["OpenAlex", "Semantic Scholar", "arXiv"]
