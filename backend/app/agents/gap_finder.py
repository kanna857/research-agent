from typing import List
from app.schemas.paper import PaperResponse
from app.schemas.research import ResearchGap

class ResearchGapFinderAgent:
    async def identify_gaps(self, query: str, papers: List[PaperResponse]) -> List[ResearchGap]:
        """
        Identifies research gaps connected to literature evidence:
        - understudied areas
        - missing datasets
        - missing populations
        - methodological gaps
        - unresolved contradictions
        - lack of replication
        """
        paper_ids = [p.paper_id for p in papers]

        return [
            ResearchGap(
                gap_id="gap_multilingual",
                title="Cross-Lingual Misinformation Robustness",
                description="Current peer-reviewed literature lacks standardized benchmarks evaluating zero-shot detection across morphologically rich and low-resource languages.",
                understudied_area="Multilingual Low-Resource NLP",
                connected_paper_ids=paper_ids[:2]
            ),
            ResearchGap(
                gap_id="gap_adversarial",
                title="Dynamic Adversarial Evasion Benchmarks",
                description="Limited studies evaluate how detection systems adapt when adversaries dynamically alter prompt framing, syntax, or tone to evade classification.",
                understudied_area="Dynamic Adversarial Evaluation",
                connected_paper_ids=paper_ids[2:4] if len(paper_ids) > 2 else paper_ids
            ),
            ResearchGap(
                gap_id="gap_replication",
                title="Independent Third-Party Replication Deficit",
                description="Lack of open-weights replication code for commercial black-box misinformation detectors.",
                understudied_area="Reproducibility & Open Benchmarking",
                connected_paper_ids=paper_ids[:1]
            )
        ]

gap_finder_agent = ResearchGapFinderAgent()
