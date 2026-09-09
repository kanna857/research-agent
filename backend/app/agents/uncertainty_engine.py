from typing import Dict, Any, List
from app.schemas.trust import ConfidenceLevel, TrustAnalysis
from app.schemas.claim import ClaimResponse, VerificationStatus

class UncertaintyEngineAgent:
    async def evaluate_uncertainty(self, trust_analysis: TrustAnalysis, claims: List[ClaimResponse] = None) -> Dict[str, Any]:
        """
        Evidence Sufficiency Gate & Uncertainty Engine.
        Evaluates verdict states:
        - SUPPORTED
        - PARTIALLY_SUPPORTED
        - CONTRADICTED
        - UNCERTAIN
        - INSUFFICIENT_EVIDENCE

        Explicitly answers "I don't know" when evidence is insufficient, explaining:
        - what is known
        - what is unknown
        - what evidence is missing
        - what would be required to increase confidence
        """
        confidence_state = trust_analysis.confidence_level.value
        
        # Check Evidence Sufficiency Gate
        is_insufficient = (
            trust_analysis.confidence_level == ConfidenceLevel.INSUFFICIENT_EVIDENCE or
            not claims or
            all(c.verification_status == VerificationStatus.INSUFFICIENT_EVIDENCE for c in claims)
        )

        if is_insufficient:
            confidence_state = "INSUFFICIENT_EVIDENCE"
            verdict_summary = "INSUFFICIENT EVIDENCE: Literature does not contain sufficient empirical proof to verify this claim."
        else:
            supported_cnt = sum(1 for c in (claims or []) if c.verification_status == VerificationStatus.SUPPORTED)
            contradicted_cnt = sum(1 for c in (claims or []) if c.verification_status == VerificationStatus.CONTRADICTED)
            
            if contradicted_cnt > supported_cnt:
                verdict_summary = "CONTRADICTED: Literature contains opposing or conflicting empirical findings."
            elif supported_cnt >= len(claims or []) * 0.7 and trust_analysis.overall_trust_score >= 75.0:
                verdict_summary = "SUPPORTED: Empirical evidence in literature strongly supports the claim."
            elif supported_cnt > 0:
                verdict_summary = "PARTIALLY_SUPPORTED: Literature supports the claim conditionally under specific benchmark settings."
            else:
                verdict_summary = "UNCERTAIN: Evidence is conflicting or ambiguous across studies."

        requirements_for_higher_confidence = [
            "Conduct independent cross-lingual evaluation on under-represented low-resource languages.",
            "Standardize evaluation metric definitions across competing benchmark suites.",
            "Publish open source model weights and reproducibility code test scripts."
        ]

        return {
            "verdict_state": confidence_state,
            "verdict_summary": verdict_summary,
            "uncertainty_score": round(100.0 - trust_analysis.overall_trust_score, 1),
            "is_insufficient": is_insufficient,
            "knowns": trust_analysis.knowns,
            "unknowns": trust_analysis.unknowns,
            "missing_evidence": trust_analysis.missing_evidence,
            "requirements_to_increase_confidence": requirements_for_higher_confidence
        }

uncertainty_engine_agent = UncertaintyEngineAgent()
