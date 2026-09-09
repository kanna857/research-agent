import httpx
import xml.etree.ElementTree as ET
import logging
from typing import List
from app.schemas.paper import PaperCreate

logger = logging.getLogger(__name__)

class ArxivService:
    BASE_URL = "http://export.arxiv.org/api/query"

    async def search_papers(self, query: str, limit: int = 5) -> List[PaperCreate]:
        """
        Retrieves real preprints from arXiv API.
        """
        params = {
            "search_query": f"all:{query}",
            "start": 0,
            "max_results": limit
        }
        papers: List[PaperCreate] = []
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.BASE_URL, params=params)
                if resp.status_code == 200:
                    root = ET.fromstring(resp.text)
                    ns = {"atom": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
                    
                    for entry in root.findall("atom:entry", ns):
                        raw_id = entry.findtext("atom:id", default="", namespaces=ns)
                        paper_id = f"arxiv:{raw_id.split('/')[-1]}"
                        title = entry.findtext("atom:title", default="", namespaces=ns).strip().replace("\n", " ")
                        if not title:
                            continue
                        
                        summary = entry.findtext("atom:summary", default="", namespaces=ns).strip().replace("\n", " ")
                        published = entry.findtext("atom:published", default="", namespaces=ns)
                        year = int(published[:4]) if len(published) >= 4 else None
                        
                        authors = [a.findtext("atom:name", default="", namespaces=ns) for a in entry.findall("atom:author", ns)]
                        url = raw_id

                        papers.append(PaperCreate(
                            paper_id=paper_id,
                            title=title,
                            authors=authors[:5],
                            year=year,
                            abstract=summary,
                            doi=None,
                            url=url,
                            source="arXiv",
                            citation_count=0
                        ))
        except Exception as e:
            logger.error(f"Error fetching from arXiv: {e}")
        return papers

arxiv_service = ArxivService()
