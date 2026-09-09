import sys
import os
sys.path.insert(0, os.path.abspath("backend"))

import asyncio
import json
import logging
from app.database.session import init_db, AsyncSessionLocal
from app.database.models import ResearchSessionModel
from app.api.v1.research import run_local_research_pipeline
from app.schemas.research import WorkflowStage

logging.basicConfig(level=logging.INFO)

async def main():
    print("=" * 80)
    print("KNOWSURE PHASE 2 E2E LIVE PIPELINE TEST")
    print("=" * 80)
    
    await init_db()
    
    query = "Can large language models reliably detect misinformation across different languages and domains?"
    session_id = "e2e_test_phase2_session"
    
    async with AsyncSessionLocal() as db:
        # Create session record
        existing = await db.get(ResearchSessionModel, session_id)
        if existing:
            await db.delete(existing)
            await db.commit()

        session_obj = ResearchSessionModel(
            session_id=session_id,
            query=query,
            current_stage=WorkflowStage.PLANNING.value,
            progress_percentage=5
        )
        db.add(session_obj)
        await db.commit()

        print(f"\n[1] Initiated research session: {session_id}")
        print(f"    Query: '{query}'")

        # Execute full local pipeline (real API retrieval from OpenAlex, Semantic Scholar, arXiv)
        print("\n[2] Executing pipeline (retrieving real academic literature)...")
        await run_local_research_pipeline(session_id, query, max_papers=6, db=db)

        # Retrieve resulting record
        result = await db.get(ResearchSessionModel, session_id)
        
        print("\n" + "=" * 80)
        print("PIPELINE RESULT VERIFICATION")
        print("=" * 80)
        print(f"Status Stage: {result.current_stage}")
        print(f"Progress: {result.progress_percentage}%")
        
        papers = result.papers_json or []
        claims = result.claims_json or []
        trust = result.trust_json or {}
        judgement = result.judgement_json or {}
        
        print(f"\nReal Academic Papers Retrieved: {len(papers)}")
        for idx, p in enumerate(papers, 1):
            print(f"  {idx}. [{p['source']}] {p['title']} ({p.get('year') or 'N/A'}) - DOI: {p.get('doi') or 'N/A'}")
            
        print(f"\nClaims Extracted & Verified: {len(claims)}")
        for idx, c in enumerate(claims, 1):
            print(f"  {idx}. [{c['verification_status']}] Claim {c['id']}: {c['statement'][:80]}...")
            print(f"     Explanation: {c['explanation']}")

        print(f"\nTrust Engine Score: {trust.get('overall_trust_score')}/100 ({trust.get('confidence_level')})")
        print(f"Final Verdict: {judgement.get('status')} - Passed Firewall: {judgement.get('firewall_passed')}")

        assert len(papers) > 0, "No real papers retrieved!"
        assert len(claims) > 0, "No claims extracted!"
        assert result.current_stage == "COMPLETED", "Pipeline did not reach COMPLETED state!"
        
        print("\n[SUCCESS] END-TO-END TEST PASSED SUCCESSFULLY WITH REAL ACADEMIC EVIDENCE!")

if __name__ == "__main__":
    asyncio.run(main())
