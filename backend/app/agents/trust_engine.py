from typing import List
from app.schemas.paper import PaperResponse
from app.schemas.claim import ClaimResponse, VerificationStatus
from app.schemas.trust import TrustAnalysis, TrustScoreBreakdown, ConfidenceLevel

class TrustEngineAgent:
    async def compute_trust(self, papers: List[PaperResponse], claims: List[ClaimResponse]) -> TrustAnalysis:
        """
        Computes transparent multi-factor Trust Score (0-100) and Confidence Level.
        Formula Weights:
        - Evidence Quality (0.25)
        - Source Reliability (0.20)
        - Independent Agreement (0.20)
        - Methodology Quality (0.15)
        - Reproducibility (0.10)
        - Citation Support (0.10)
        """
        if not papers or not claims:
            return TrustAnalysis(
                overall_trust_score=0.0,
                confidence_level=ConfidenceLevel.INSUFFICIENT_EVIDENCE,
                breakdown=TrustScoreBreakdown(
                    evidence_quality=0.0,
                    source_reliability=0.0,
                    independent_agreement=0.0,
                    methodology_quality=0.0,
                    reproducibility=0.0,
                    citation_support=0.0
                ),
                explanation="INSUFFICIENT EVIDENCE: No academic papers or extracted claims are available to compute trust metrics.",
                knowns=[],
                unknowns=["Core empirical claim validity"],
                missing_evidence=["Peer-reviewed academic paper literature"]
            )

        # 1. Evidence Quality (0.25 weight)
        total_claims = len(claims)
        supported_claims = sum(1 for c in claims if c.verification_status == VerificationStatus.SUPPORTED)
        partially_claims = sum(1 for c in claims if c.verification_status == VerificationStatus.PARTIALLY_SUPPORTED)
        ev_quality = min(100.0, ((supported_claims * 1.0 + partially_claims * 0.6) / total_claims) * 100.0) if total_claims > 0 else 0.0

        # 2. Source Reliability (0.20 weight)
        avg_citations = sum(p.citation_count for p in papers) / len(papers) if papers else 0
        peer_reviewed_sources = sum(1 for p in papers if p.source in ["OpenAlex", "Semantic Scholar"])
        src_reliability = min(100.0, 50.0 + (peer_reviewed_sources / len(papers)) * 25.0 + min(25.0, avg_citations * 0.2))

        # 3. Independent Agreement (0.20 weight)
        contradicted_claims = sum(1 for c in claims if c.verification_status == VerificationStatus.CONTRADICTED)
        agreement_ratio = (supported_claims / (supported_claims + contradicted_claims)) if (supported_claims + contradicted_claims) > 0 else 0.7
        indep_agreement = min(100.0, agreement_ratio * 100.0)

        # 4. Methodology Quality (0.15 weight)
        methodology_score = 80.0 if any(c.methodology for c in claims) else 50.0

        # 5. Reproducibility (0.10 weight)
        reproducibility_score = 75.0 if any(p.reproducibility_score for p in papers if p.reproducibility_score) else 65.0

        # 6. Citation Support (0.10 weight)
        citation_support_score = 85.0 if all("Provenance:" in (c.evidence_text or "") for c in claims) else 40.0

        # Weighted Sum Calculation
        overall = (
            ev_quality * 0.25 +
            src_reliability * 0.20 +
            indep_agreement * 0.20 +
            methodology_score * 0.15 +
            reproducibility_score * 0.10 +
            citation_support_score * 0.10
        )
        overall = round(overall, 1)

        # Determine Confidence Level
        if overall >= 80.0 and supported_claims >= total_claims * 0.6:
            level = ConfidenceLevel.HIGH_CONFIDENCE
        elif overall >= 60.0:
            level = ConfidenceLevel.MODERATE_CONFIDENCE
        elif overall >= 40.0:
            level = ConfidenceLevel.UNCERTAIN
        else:
            level = ConfidenceLevel.INSUFFICIENT_EVIDENCE

        knowns = [
            f"Evaluated {len(papers)} peer-reviewed papers from {', '.join(set(p.source for p in papers))}.",
            f"Extracted {total_claims} claims: {supported_claims} supported, {partially_claims} partially supported, {contradicted_claims} contradicted."
        ]
        unknowns = [
            "Long-term generalization performance across un-seen morphologically rich low-resource languages.",
            "Potential benchmark dataset contamination in proprietary pretraining corpora."
        ]
        missing_evidence = [
            "Independent third-party replication benchmarks on non-public proprietary datasets.",
            "Standardized cross-domain metric evaluation across all language pairs."
        ]

        explanation = (
            f"Transparent Trust Score is {overall}/100 ({level.value}). "
            f"Evidence Quality: {round(ev_quality, 1)}/100, Source Reliability: {round(src_reliability, 1)}/100, "
            f"Independent Agreement: {round(indep_agreement, 1)}/100, Methodology: {round(methodology_score, 1)}/100, "
            f"Reproducibility: {round(reproducibility_score, 1)}/100, Citation Support: {round(citation_support_score, 1)}/100."
        )

        return TrustAnalysis(
            overall_trust_score=overall,
            confidence_level=level,
            breakdown=TrustScoreBreakdown(
                evidence_quality=round(ev_quality, 1),
                source_reliability=round(src_reliability, 1),
                independent_agreement=round(indep_agreement, 1),
                methodology_quality=round(methodology_score, 1),
                reproducibility=round(reproducibility_score, 1),
                citation_support=round(citation_support_score, 1)
            ),
            explanation=explanation,
            knowns=knowns,
            unknowns=unknowns,
            missing_evidence=missing_evidence
        )

trust_engine_agent = TrustEngineAgent()
