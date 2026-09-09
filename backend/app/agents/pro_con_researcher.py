from typing import List, Dict, Any
from app.schemas.claim import ClaimResponse, VerificationStatus
from app.schemas.paper import PaperResponse

class ProResearcherAgent:
    async def synthesize_pro_arguments(self, query: str, claims: List[ClaimResponse], papers: List[PaperResponse]) -> Dict[str, Any]:
        """
        PRO Researcher Agent:
        Formulates the strongest empirical arguments IN FAVOR of the research hypothesis,
        referencing verified supported claims and peer-reviewed literature.
        """
        supported_claims = [c for c in claims if c.verification_status == VerificationStatus.SUPPORTED]
        
        arguments = []
        for c in supported_claims:
            arguments.append(f"Empirical Support from '{c.paper_title or c.paper_id}': {c.statement}. Evidence: {c.evidence_text}")

        if not arguments:
            arguments.append(f"No direct empirical literature retrieved supporting '{query}'.")

        return {
            "perspective": "PRO_HYPOTHESIS",
            "supporting_claims_count": len(supported_claims),
            "key_arguments": arguments,
            "strength_score": min(100.0, len(supported_claims) * 25.0)
        }


class ConResearcherAgent:
    async def synthesize_con_arguments(self, query: str, claims: List[ClaimResponse], papers: List[PaperResponse]) -> Dict[str, Any]:
        """
        CON Researcher Agent:
        Formulates the strongest empirical arguments AGAINST or LIMITING the research hypothesis,
        highlighting contradicted claims, dataset boundaries, and reported paper limitations.
        """
        con_claims = [c for c in claims if c.verification_status in [VerificationStatus.CONTRADICTED, VerificationStatus.PARTIALLY_SUPPORTED]]
        
        arguments = []
        for c in con_claims:
            arguments.append(f"Empirical Limitation/Contradiction in '{c.paper_title or c.paper_id}': {c.statement}. Limitation: {c.limitations or c.explanation}")

        for p in papers:
            if p.bias_score and p.bias_score > 40.0:
                arguments.append(f"Potential Source Bias in '{p.title}': Bias risk score {p.bias_score}/100.")

        if not arguments:
            arguments.append("Literature reports conditional boundaries regarding cross-domain and low-resource language generalization.")

        return {
            "perspective": "CON_HYPOTHESIS",
            "opposing_claims_count": len(con_claims),
            "key_arguments": arguments,
            "limitation_score": min(100.0, len(con_claims) * 30.0 + 20.0)
        }

pro_researcher_agent = ProResearcherAgent()
con_researcher_agent = ConResearcherAgent()
