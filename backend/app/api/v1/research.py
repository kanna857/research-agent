import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.database.models import ResearchSessionModel, PaperModel, ClaimModel, EvidenceModel
from app.schemas.research import (
    ResearchRequest, ResearchStatusResponse, WorkflowStage, ClarificationRequest, ClarificationResponse
)

from app.agents.planner import planner_agent
from app.agents.retriever import retriever_agent
from app.agents.extractor import extractor_agent
from app.agents.verifier import verifier_agent
from app.agents.contradiction import contradiction_agent
from app.agents.trust_engine import trust_engine_agent
from app.agents.pro_con_researcher import pro_researcher_agent, con_researcher_agent
from app.agents.red_team import red_team_agent
from app.agents.gap_finder import gap_finder_agent
from app.agents.judge import judge_agent
from app.agents.firewall import firewall_agent
from app.agents.ranking_agent import ranking_agent
from app.agents.audit_agent import audit_agent
from app.agents.replication_agent import replication_agent
from app.services.n8n_client import n8n_client
from app.services.qdrant_service import qdrant_service

router = APIRouter()

@router.post("/research/clarify", response_model=ClarificationResponse)
async def clarify_research(req: ClarificationRequest):
    """
    Intake step generating smart pre-research follow-up questions and prompt refinements
    to clarify research goals upfront before execution.
    """
    return await planner_agent.generate_followup_questions(req.query)

async def run_local_research_pipeline(
    session_id: str,
    query: str,
    max_papers: int,
    db: AsyncSession,
    breadth: int = 3,
    depth: int = 2,
    enable_web_search: bool = True,
    clarification_answers: dict = None
):
    """
    Executes the full autonomous research pipeline locally, incorporating breadth, depth,
    broad web search & crawling, paper ranking, audits, and judge verification.
    """
    try:
        # 1. Planning Stage
        plan = await planner_agent.plan(
            query=query,
            breadth=breadth,
            depth=depth,
            clarification_answers=clarification_answers
        )
        session_obj = await db.get(ResearchSessionModel, session_id)
        if session_obj:
            session_obj.current_stage = WorkflowStage.PLANNING.value
            session_obj.progress_percentage = 15
            session_obj.plan_json = plan.model_dump()
            await db.commit()

        # 2. Academic Retrieval + Broad Web Search & Crawling
        raw_papers = await retriever_agent.retrieve_and_normalize(
            queries=plan.search_queries,
            max_papers=max_papers,
            enable_web_search=enable_web_search,
            depth=depth
        )
        papers = await ranking_agent.rank_papers(raw_papers, query)
        
        # 3. Paper Audits & Replication Feasibility Analyses
        for p in papers:
            await audit_agent.audit_paper(p)
            await replication_agent.analyze_replication(p)

        if session_obj:
            session_obj.current_stage = WorkflowStage.RETRIEVAL.value
            session_obj.progress_percentage = 35
            session_obj.papers_json = [p.model_dump() for p in papers]
            await db.commit()

        # Persist Papers
        for p in papers:
            stmt = select(PaperModel).where(PaperModel.paper_id == p.paper_id)
            res = await db.execute(stmt)
            existing_paper = res.scalars().first()
            if not existing_paper:
                db.add(PaperModel(
                    paper_id=p.paper_id,
                    title=p.title,
                    authors=p.authors,
                    year=p.year,
                    abstract=p.abstract,
                    doi=p.doi,
                    url=p.url,
                    source=p.source,
                    citation_count=p.citation_count
                ))
        await db.commit()

        # 3. Evidence & Claim Extraction
        raw_claims = await extractor_agent.extract_claims(papers, query)
        verified_claims = await verifier_agent.verify_claims(raw_claims)
        if session_obj:
            session_obj.current_stage = WorkflowStage.CLAIM_VERIFICATION.value
            session_obj.progress_percentage = 55
            session_obj.claims_json = [c.model_dump() for c in verified_claims]
            await db.commit()

        # Persist Claims & Evidence
        for c in verified_claims:
            stmt = select(ClaimModel).where(ClaimModel.claim_id == c.claim_id)
            res = await db.execute(stmt)
            existing_claim = res.scalars().first()
            if not existing_claim:
                claim_db = ClaimModel(
                    claim_id=c.claim_id,
                    session_id=session_id,
                    paper_id=c.paper_id,
                    statement=c.statement,
                    verification_status=c.verification_status.value,
                    confidence_score=c.confidence_score,
                    explanation=c.explanation
                )
                db.add(claim_db)
                
                evidence_db = EvidenceModel(
                    evidence_id=f"ev_{c.claim_id}",
                    claim_id=c.claim_id,
                    paper_id=c.paper_id,
                    evidence_text=c.evidence_text,
                    methodology=c.methodology,
                    dataset=c.dataset,
                    sample_size=c.sample_size,
                    metrics=c.metrics,
                    results=c.results,
                    limitations=c.limitations,
                    citation_provenance=c.explanation or c.paper_title
                )
                db.add(evidence_db)
        await db.commit()

        # Upsert evidence vectors into Qdrant
        await qdrant_service.upsert_evidence([c.model_dump() for c in verified_claims])

        # 4. Contradiction Detection
        contradictions = await contradiction_agent.detect_contradictions(verified_claims)

        # 5. Trust & Uncertainty Scoring
        trust_analysis = await trust_engine_agent.compute_trust(papers, verified_claims)

        # 6. PRO and CON Researcher Syntheses
        pro_args = await pro_researcher_agent.synthesize_pro_arguments(query, verified_claims, papers)
        con_args = await con_researcher_agent.synthesize_con_arguments(query, verified_claims, papers)

        # 7. Red-Team Adversarial Audit
        red_team_findings = await red_team_agent.audit_hypothesis(query, verified_claims)

        # 8. Research Gap Identification
        research_gaps = await gap_finder_agent.identify_gaps(query, papers)

        # 9. Judge Stage
        raw_judgement = await judge_agent.judge(query, verified_claims, trust_analysis, pro_args, con_args, red_team_findings)

        # 10. Final Evidence Firewall
        final_judgement = await firewall_agent.validate(raw_judgement, verified_claims, papers)

        # 11. Report Markdown Generation
        report_md = f"""# KnowSure Empirical Research Report

## Executive Summary
**Research Question:** {query}
**Verdict Status:** `{final_judgement.status.value}`
**Overall Trust Score:** {trust_analysis.overall_trust_score}/100

{final_judgement.main_conclusion}

### Core Reasoning
{final_judgement.reasoning}

---

## PRO Researcher Synthesis (Supporting Arguments)
""" + "\n".join([f"- {arg}" for arg in pro_args["key_arguments"]]) + f"""

---

## CON Researcher Synthesis (Limitations & Boundaries)
""" + "\n".join([f"- {arg}" for arg in con_args["key_arguments"]]) + f"""

---

## Literature Analyzed ({len(papers)} Papers)
""" + "\n".join([f"- **{p.title}** ({p.year or 'N/A'}) — *{p.source}* [DOI: {p.doi or 'N/A'}]" for p in papers]) + f"""

---

## Claim-Level Evidence & Citation Provenance ({len(verified_claims)} Claims)
""" + "\n".join([f"### [{c.verification_status.value}] Claim {c.id}: {c.statement}\n- **Evidence:** {c.evidence_text}\n- **Provenance:** {c.explanation}\n" for c in verified_claims]) + f"""

---

## Contradictions & Methodological Variance ({len(contradictions)})
""" + "\n".join([f"- **[{c.type}]** {c.description}" for c in contradictions]) + f"""

---

## Trust Engine Breakdown
- **Evidence Quality:** {trust_analysis.breakdown.evidence_quality}/100
- **Source Reliability:** {trust_analysis.breakdown.source_reliability}/100
- **Independent Agreement:** {trust_analysis.breakdown.independent_agreement}/100
- **Methodology Quality:** {trust_analysis.breakdown.methodology_quality}/100
- **Reproducibility:** {trust_analysis.breakdown.reproducibility}/100
- **Citation Support:** {trust_analysis.breakdown.citation_support}/100

---

## Adversarial Red-Team Findings ({len(red_team_findings)})
""" + "\n".join([f"- **[{r.severity} - {r.category}]** {r.challenge}" for r in red_team_findings]) + f"""

---

## Research Gaps Identified ({len(research_gaps)})
""" + "\n".join([f"- **{g.title}**: {g.description}" for g in research_gaps]) + """

---

*Generated by KnowSure Research Intelligence Platform protected by Final Evidence Firewall.*
"""

        if session_obj:
            session_obj.current_stage = WorkflowStage.COMPLETED.value
            session_obj.progress_percentage = 100
            session_obj.contradictions_json = [c.model_dump() for c in contradictions]
            session_obj.trust_json = trust_analysis.model_dump()
            session_obj.red_team_json = [r.model_dump() for r in red_team_findings]
            session_obj.research_gaps_json = [g.model_dump() for g in research_gaps]
            session_obj.judgement_json = final_judgement.model_dump()
            session_obj.report_markdown = report_md
            await db.commit()

    except Exception as e:
        session_obj = await db.get(ResearchSessionModel, session_id)
        if session_obj:
            session_obj.current_stage = WorkflowStage.FAILED.value
            session_obj.error = str(e)
            await db.commit()


@router.post("/research", response_model=ResearchStatusResponse)
async def start_research(
    req: ResearchRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    session_id = f"rs_{uuid.uuid4().hex[:12]}"
    
    session_obj = ResearchSessionModel(
        session_id=session_id,
        query=req.query,
        current_stage=WorkflowStage.PLANNING.value,
        progress_percentage=5
    )
    db.add(session_obj)
    await db.commit()

    triggered_n8n = await n8n_client.trigger_research_workflow(session_id, req.query, req.max_papers)
    if not triggered_n8n:
        background_tasks.add_task(
            run_local_research_pipeline,
            session_id,
            req.query,
            req.max_papers,
            db,
            req.breadth,
            req.depth,
            req.enable_web_search,
            req.clarification_answers
        )

    return ResearchStatusResponse(
        session_id=session_id,
        query=req.query,
        current_stage=WorkflowStage.PLANNING,
        progress_percentage=10
    )


@router.get("/research/{session_id}", response_model=ResearchStatusResponse)
async def get_research_status(session_id: str, db: AsyncSession = Depends(get_db)):
    session_obj = await db.get(ResearchSessionModel, session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Research session not found")

    papers = session_obj.papers_json or []
    claims = session_obj.claims_json or []

    supported_count = sum(1 for c in claims if c.get("verification_status") == "SUPPORTED")
    contradicted_count = sum(1 for c in claims if c.get("verification_status") == "CONTRADICTED")
    insufficient_count = sum(1 for c in claims if c.get("verification_status") == "INSUFFICIENT_EVIDENCE")

    return ResearchStatusResponse(
        session_id=session_obj.session_id,
        query=session_obj.query,
        current_stage=WorkflowStage(session_obj.current_stage),
        progress_percentage=session_obj.progress_percentage or 0,
        papers_found_count=len(papers),
        relevant_papers_count=len(papers),
        claims_extracted_count=len(claims),
        supported_claims_count=supported_count,
        contradicted_claims_count=contradicted_count,
        insufficient_claims_count=insufficient_count,
        plan=session_obj.plan_json,
        papers=papers,
        claims=claims,
        contradictions=session_obj.contradictions_json or [],
        trust_analysis=session_obj.trust_json,
        red_team_findings=session_obj.red_team_json or [],
        research_gaps=session_obj.research_gaps_json or [],
        final_judgement=session_obj.judgement_json,
        report_markdown=session_obj.report_markdown,
        error=session_obj.error
    )
