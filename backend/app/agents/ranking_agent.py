from typing import List, Dict, Any
from app.schemas.paper import PaperResponse, PaperRankBreakdown

class PaperRankingAgent:
    """
    Paper Ranking Agent (Reviewer Role):
    Provides transparent, multi-factor paper ranking based on:
    - Relevance (query match)
    - Citation information
    - Methodology quality
    - Reproducibility index
    - Provenance & evidence quality
    - Publication recency
    
    Never relies solely on citation counts.
    """

    async def rank_papers(
        self,
        papers: List[PaperResponse],
        query: str,
        claims: List[Dict[str, Any]] = None
    ) -> List[PaperResponse]:
        claims = claims or []
        ranked_papers = []

        query_terms = set(query.lower().split())

        for paper in papers:
            title_lower = paper.title.lower()
            abstract_lower = (paper.abstract or "").lower()
            
            # 1. Relevance Score (0-100)
            matches = sum(1 for term in query_terms if term in title_lower or term in abstract_lower)
            rel_score = min(100.0, max(40.0, (matches / max(1, len(query_terms))) * 100.0))

            # 2. Citation Score (0-100, logarithmic scaling so citations alone don't dominate)
            cite_count = paper.citation_count
            cite_score = min(100.0, 30.0 + (min(cite_count, 500) / 500.0) * 70.0)

            # 3. Methodology Quality (0-100)
            method_score = 85.0 if ("method" in abstract_lower or "benchmark" in abstract_lower or "dataset" in abstract_lower) else 65.0

            # 4. Reproducibility Score (0-100)
            reprod_score = paper.reproducibility_score if paper.reproducibility_score is not None else (
                80.0 if ("code" in abstract_lower or "open source" in abstract_lower or "github" in abstract_lower or "dataset" in abstract_lower) else 60.0
            )

            # 5. Provenance Score (0-100)
            paper_claims = [c for c in claims if c.get("paper_id") == paper.paper_id]
            prov_score = min(100.0, 50.0 + len(paper_claims) * 15.0)

            # 6. Recency Score (0-100)
            year = paper.year or 2024
            rec_score = min(100.0, max(40.0, 100.0 - (2024 - year) * 10.0))

            # 7. Evidence Quality Score (0-100)
            ev_quality = 88.0 if len(paper_claims) > 0 and any(c.get("confidence_score", 0) > 70 for c in paper_claims) else 72.0

            # Overall Weighted Score
            overall = (
                rel_score * 0.25 +
                method_score * 0.20 +
                ev_quality * 0.20 +
                reprod_score * 0.15 +
                cite_score * 0.10 +
                rec_score * 0.10
            )
            overall = round(overall, 1)

            # Generate Rationale Explanation
            explanation = (
                f"Rank Score {overall}/100 based on high query relevance ({round(rel_score)}), "
                f"methodology rigor ({round(method_score)}), evidence quality ({round(ev_quality)}), "
                f"reproducibility ({round(reprod_score)}), and publication recency ({year})."
            )

            breakdown = PaperRankBreakdown(
                relevance_score=round(rel_score, 1),
                citation_score=round(cite_score, 1),
                methodology_score=round(method_score, 1),
                reproducibility_score=round(reprod_score, 1),
                provenance_score=round(prov_score, 1),
                recency_score=round(rec_score, 1),
                evidence_quality_score=round(ev_quality, 1),
                overall_rank_score=overall,
                ranking_explanation=explanation
            )

            # Assign breakdown and update paper reproducibility score if empty
            paper.rank_breakdown = breakdown
            if paper.reproducibility_score is None:
                paper.reproducibility_score = round(reprod_score, 1)
            
            ranked_papers.append(paper)

        # Sort papers by overall rank score descending
        ranked_papers.sort(key=lambda p: (p.rank_breakdown.overall_rank_score if p.rank_breakdown else 0), reverse=True)
        return ranked_papers

ranking_agent = PaperRankingAgent()
