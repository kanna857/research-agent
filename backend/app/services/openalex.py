import httpx
import logging
from typing import List
from app.schemas.paper import PaperCreate
from app.core.config import settings

logger = logging.getLogger(__name__)

class OpenAlexService:
    BASE_URL = "https://api.openalex.org/works"

    async def search_papers(self, query: str, limit: int = 5) -> List[PaperCreate]:
        """
        Retrieves real academic literature from OpenAlex API.
        Never fabricates metadata.
        """
        params = {
            "search": query,
            "per_page": limit,
            "mailto": settings.OPENALEX_EMAIL
        }
        papers: List[PaperCreate] = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.BASE_URL, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    results = data.get("results", [])
                    for item in results:
                        paper_id = item.get("id", "").replace("https://openalex.org/", "openalex:")
                        title = item.get("display_name") or item.get("title")
                        if not title:
                            continue
                        
                        year = item.get("publication_year")
                        doi = item.get("doi")
                        url = doi or item.get("landing_page_url") or item.get("id")
                        citation_count = item.get("cited_by_count", 0)
                        
                        authorships = item.get("authorships", [])
                        authors = [a.get("author", {}).get("display_name") for a in authorships if a.get("author", {}).get("display_name")]

                        # Extract abstract from inverted index if present
                        abstract = None
                        inverted = item.get("abstract_inverted_index")
                        if inverted:
                            try:
                                words = {}
                                for word, pos_list in inverted.items():
                                    for pos in pos_list:
                                        words[pos] = word
                                abstract = " ".join([words[i] for i in sorted(words.keys())])
                            except Exception:
                                abstract = None

                        papers.append(PaperCreate(
                            paper_id=paper_id,
                            title=title,
                            authors=authors[:5],
                            year=year,
                            abstract=abstract,
                            doi=doi,
                            url=url,
                            source="OpenAlex",
                            citation_count=citation_count
                        ))
        except Exception as e:
            logger.error(f"Error fetching from OpenAlex: {e}")
        return papers

openalex_service = OpenAlexService()
