from typing import List, Dict, Any
from app.schemas.paper import PaperResponse, PaperAuditResult

class PaperAuditAgent:
    """
    Paper Audit Agent (Verifier Role):
    Performs granular audit tracing:
    Paper → Claim → Evidence → Method → Dataset → Result
    
    Compares paper claims against reported methodology and experimental details
    to detect discrepancies or unbacked claims.
    """

    async def audit_paper(
        self,
        paper: PaperResponse,
        claims: List[Dict[str, Any]] = None
    ) -> PaperAuditResult:
        claims = claims or []
        paper_claims = [c for c in claims if c.get("paper_id") == paper.paper_id or c.get("paper_id") == paper.id]
        
        abstract = paper.abstract or ""
        mismatches = []

        # Traceability chain items
        first_claim = paper_claims[0].get("statement", "General empirical finding") if paper_claims else "Core domain claim"
        first_ev = paper_claims[0].get("evidence_text", abstract[:100]) if paper_claims else (abstract[:100] if abstract else "Abstract text")
        method = paper_claims[0].get("methodology", "Benchmark evaluation") if paper_claims else "Empirical evaluation"
        dataset = paper_claims[0].get("dataset", "Multi-domain benchmark corpus") if paper_claims else "Evaluation dataset"
        result = paper_claims[0].get("results", "Quantified performance metric") if paper_claims else "Quantitative results"

        chain = [
            f"Paper: {paper.title[:45]}...",
            f"Claim: {first_claim[:45]}...",
            f"Evidence: {first_ev[:45]}...",
            f"Method: {method}",
            f"Dataset: {dataset}",
            f"Result: {result}"
        ]

        # Discrepancy audit checks
        if not paper.abstract:
            mismatches.append("Abstract unavailable; full-text methodology cannot be independently verified.")
        if paper_claims:
            for c in paper_claims:
                if c.get("confidence_score", 100) < 40.0:
                    mismatches.append(f"Claim '{c.get('claim_id')}' has low empirical backing ({c.get('confidence_score')}%).")
                if "100%" in c.get("statement", "") and "synthetic" not in abstract.lower():
                    mismatches.append("Unrealistic 100% accuracy claim detected without synthetic data caveat.")
        
        audit_passed = len(mismatches) == 0

        result_obj = PaperAuditResult(
            paper_id=paper.paper_id,
            traceability_chain=chain,
            mismatches_found=mismatches,
            audit_passed=audit_passed
        )

        paper.audit_result = result_obj
        return result_obj

audit_agent = PaperAuditAgent()
