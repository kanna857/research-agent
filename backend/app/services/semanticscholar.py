import httpx
import logging
from typing import List
from app.schemas.paper import PaperCreate
from app.core.config import settings

logger = logging.getLogger(__name__)

class SemanticScholarService:
    BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

    async def search_papers(self, query: str, limit: int = 5) -> List[PaperCreate]:
        """
        Retrieves real academic papers from Semantic Scholar API.
        """
        params = {
            "query": query,
            "limit": limit,
            "fields": "paperId,title,authors,year,abstract,externalIds,url,citationCount"
        }
        headers = {}
        if settings.SEMANTIC_SCHOLAR_API_KEY:
            headers["x-api-key"] = settings.SEMANTIC_SCHOLAR_API_KEY

        papers: List[PaperCreate] = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.BASE_URL, params=params, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    results = data.get("data", [])
                    for item in results:
                        paper_id = f"s2:{item.get('paperId')}"
                        title = item.get("title")
                        if not title:
                            continue

                        authors = [a.get("name") for a in item.get("authors", []) if a.get("name")]
                        year = item.get("year")
                        abstract = item.get("abstract")
                        ext_ids = item.get("externalIds") or {}
                        doi = f"https://doi.org/{ext_ids.get('DOI')}" if ext_ids.get("DOI") else None
                        url = item.get("url") or doi
                        citation_count = item.get("citationCount", 0)

                        papers.append(PaperCreate(
                            paper_id=paper_id,
                            title=title,
                            authors=authors[:5],
                            year=year,
                            abstract=abstract,
                            doi=doi,
                            url=url,
                            source="Semantic Scholar",
                            citation_count=citation_count
                        ))
        except Exception as e:
            logger.error(f"Error fetching from Semantic Scholar: {e}")
        return papers

semanticscholar_service = SemanticScholarService()
