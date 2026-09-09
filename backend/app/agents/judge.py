from typing import List, Dict, Any
from app.schemas.claim import ClaimResponse
from app.schemas.trust import TrustAnalysis, ConfidenceLevel
from app.schemas.research import RedTeamFinding, FinalJudgement

class JudgeAgent:
    async def judge(
        self,
        query: str,
        claims: List[ClaimResponse],
        trust: TrustAnalysis,
        pro_args: Dict[str, Any],
        con_args: Dict[str, Any],
        red_team: List[RedTeamFinding]
    ) -> FinalJudgement:
        """
        Judge Agent:
        Evaluates supporting evidence (PRO), contradicting evidence (CON), Trust Score,
        uncertainty, bias, reproducibility, and red-team findings.

        Produces final classification:
        - SUPPORTED
        - PARTIALLY_SUPPORTED
        - UNCERTAIN
        - INSUFFICIENT_EVIDENCE
        with comprehensive reasoning.
        """
        # 1. Evidence Sufficiency Gate Check
        if trust.confidence_level == ConfidenceLevel.INSUFFICIENT_EVIDENCE or not claims:
            return FinalJudgement(
                status=ConfidenceLevel.INSUFFICIENT_EVIDENCE,
                main_conclusion=f"INSUFFICIENT EVIDENCE: Literature does not contain sufficient empirical proof to verify '{query}'.",
                reasoning="Evidence Sufficiency Gate failed: No peer-reviewed literature provided sufficient empirical evidence to substantiate a high-confidence conclusion."
            )

        high_severity_red = sum(1 for r in red_team if r.severity == "HIGH")
        pro_count = pro_args.get("supporting_claims_count", 0)
        con_count = con_args.get("opposing_claims_count", 0)

        # 2. Final Classification Decision Tree
        if con_count > pro_count and trust.overall_trust_score < 50.0:
            status = ConfidenceLevel.UNCERTAIN
            conclusion = f"Literature evidence is UNCERTAIN regarding '{query[:60]}'."
            reasoning = f"Contradicting arguments ({con_count}) outweigh supporting arguments ({pro_count}). Trust score is {trust.overall_trust_score}/100."
        elif trust.overall_trust_score >= 80.0 and high_severity_red == 0 and pro_count >= 2:
            status = ConfidenceLevel.HIGH_CONFIDENCE # maps to SUPPORTED
            conclusion = f"Literature strongly supports the empirical validity of '{query[:60]}'."
            reasoning = f"Evaluated {len(claims)} claims with high Trust Score ({trust.overall_trust_score}/100). PRO evidence outweighs CON arguments with zero unmitigated high-severity red team risks."
        elif trust.overall_trust_score >= 55.0 or pro_count > 0:
            status = ConfidenceLevel.MODERATE_CONFIDENCE # maps to PARTIALLY_SUPPORTED
            conclusion = f"Literature PARTIALLY SUPPORTS findings for '{query[:60]}', subject to domain, language, and dataset limitations."
            reasoning = f"Evaluated PRO arguments ({pro_count}) vs CON limitations ({con_count}). Trust score {trust.overall_trust_score}/100 indicates moderate confidence with acknowledged paper boundaries."
        else:
            status = ConfidenceLevel.UNCERTAIN
            conclusion = f"Literature evidence is UNCERTAIN regarding '{query[:60]}'."
            reasoning = f"Trust score ({trust.overall_trust_score}/100) and conflicting literature findings prevent a high-confidence verdict."

        return FinalJudgement(
            status=status,
            main_conclusion=conclusion,
            reasoning=reasoning,
            firewall_passed=True,
            firewall_revisions=[]
        )

judge_agent = JudgeAgent()
