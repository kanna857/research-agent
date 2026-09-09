from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import ResearchSessionModel
from app.services.neo4j_service import neo4j_service

router = APIRouter()

@router.get("/graph/session/{session_id}")
async def get_session_evidence_graph(session_id: str, db: AsyncSession = Depends(get_db)):
    """
    Returns full Evidence Knowledge Graph containing Paper, Author, Claim, Evidence, Dataset, Method, Result nodes
    and AUTHORED, CONTAINS_CLAIM, SUPPORTED_BY, CONTRADICTS, USES_DATASET, USES_METHOD, REPORTS_RESULT links.
    """
    session_obj = await db.get(ResearchSessionModel, session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Research session not found")

    papers = session_obj.papers_json or []
    claims = session_obj.claims_json or []
    contradictions = session_obj.contradictions_json or []

    graph = neo4j_service.build_graph_structure(papers, claims, contradictions)
    return {
        "session_id": session_id,
        "query": session_obj.query,
        "graph": graph
    }


@router.get("/graph/claim/{claim_id}")
async def get_claim_subgraph(claim_id: str, session_id: str, db: AsyncSession = Depends(get_db)):
    """
    Returns subgraph centered on a specific claim:
    Paper → Claim → Evidence → Dataset and Claim → Contradicting Paper.
    """
    session_obj = await db.get(ResearchSessionModel, session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Research session not found")

    papers = session_obj.papers_json or []
    claims = session_obj.claims_json or []
    contradictions = session_obj.contradictions_json or []

    full_graph = neo4j_service.build_graph_structure(papers, claims, contradictions)
    target_node_id = f"claim_{claim_id}"

    # Filter connected nodes & links
    connected_links = [
        link for link in full_graph["links"]
        if link["source"] == target_node_id or link["target"] == target_node_id
    ]
    connected_node_ids = {target_node_id}
    for link in connected_links:
        connected_node_ids.add(link["source"])
        connected_node_ids.add(link["target"])

    subgraph_nodes = [node for node in full_graph["nodes"] if node["id"] in connected_node_ids]

    return {
        "claim_id": claim_id,
        "subgraph": {
            "nodes": subgraph_nodes,
            "links": connected_links
        }
    }
