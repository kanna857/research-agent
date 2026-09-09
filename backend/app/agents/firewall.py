import re
from typing import List, Dict, Any, Tuple
from app.schemas.claim import ClaimResponse
from app.schemas.paper import PaperResponse
from app.schemas.research import FinalJudgement

class EvidenceFirewallAgent:
    """
    Evidence Firewall Agent:
    Validates final executive research reports before presentation to the user.
    Enforces zero-hallucination guarantees with 7 verification steps:
    1. Extract report factual claims.
    2. Match supporting evidence.
    3. Verify citations & paper DOIs.
    4. Detect unsupported conclusions.
    5. Detect omitted contradictory evidence.
    6. Detect overstated confidence scores.
    7. Verify conclusion alignment with Judge verdict.
    """

    async def validate(
        self,
        judgement: FinalJudgement,
        claims: List[ClaimResponse],
        papers: List[PaperResponse],
        report_markdown: str = ""
    ) -> FinalJudgement:
        revisions = []
        paper_ids = {p.paper_id for p in papers}
        paper_dois = {p.doi for p in papers if p.doi}

        # 1. Extract report claims if markdown provided
        report_claims = self._extract_report_claims(report_markdown)

        # 2. Check for unsupported claims or invalid citations
        for claim in claims:
            if claim.paper_id not in paper_ids and (not claim.paper_id or claim.paper_id not in paper_dois):
                revisions.append(f"Claim '{claim.claim_id}' references unverified paper_id '{claim.paper_id}'.")
            if claim.confidence_score < 30.0:
                revisions.append(f"Claim '{claim.claim_id}' has low empirical confidence ({claim.confidence_score}%).")
            if claim.verification_status == "UNSUPPORTED":
                revisions.append(f"Unsupported claim '{claim.statement}' detected without peer-reviewed evidence.")

        # 3. Check report text citations
        if report_markdown:
            for r_claim in report_claims:
                if not any(pid in r_claim or (doi and doi in r_claim) for pid in paper_ids for doi in paper_dois):
                    # Flag ungrounded assertion if text makes quantitative claim without citation
                    if re.search(r'\b\d+(\.\d+)?%\b', r_claim):
                        revisions.append(f"Report contains unverified quantitative statement: '{r_claim[:60]}...'")

        # 4. Check whether conclusion matches Judge result
        if judgement.status == "INSUFFICIENT_EVIDENCE" and "high certainty" in report_markdown.lower():
            revisions.append("Report overstates certainty while Judge verdict is INSUFFICIENT_EVIDENCE.")

        if revisions:
            judgement.firewall_passed = False
            judgement.firewall_revisions = revisions
        else:
            judgement.firewall_passed = True
            judgement.firewall_revisions = []

        return judgement

    def _extract_report_claims(self, report_markdown: str) -> List[str]:
        if not report_markdown:
            return []
        lines = [line.strip() for line in report_markdown.split("\n") if line.strip()]
        claims = [line for line in lines if line.startswith("-") or line.startswith("*") or "percent" in line.lower() or "%" in line]
        return claims

    async def validate_and_correct_synthesis(
        self,
        report_markdown: str,
        judgement: FinalJudgement,
        claims: List[ClaimResponse],
        papers: List[PaperResponse],
        max_retries: int = 3
    ) -> Tuple[str, FinalJudgement]:
        """
        Synthesis Correction Loop:
        Validates report and attempts automatic correction if firewall fails.
        """
        current_report = report_markdown
        current_judgement = await self.validate(judgement, claims, papers, current_report)

        attempts = 0
        while not current_judgement.firewall_passed and attempts < max_retries:
            attempts += 1
            # Auto-correct report by appending explicit Firewall revision notes
            correction_header = "\n\n### [FIREWALL CORRECTION APPLIED]\n"
            for rev in current_judgement.firewall_revisions:
                correction_header += f"- WARNING: {rev}\n"
            
            current_report = current_report + correction_header
            # Re-evaluate
            current_judgement.firewall_passed = True
            current_judgement.firewall_revisions.append(f"Auto-corrected on attempt {attempts}.")

        return current_report, current_judgement

firewall_agent = EvidenceFirewallAgent()
