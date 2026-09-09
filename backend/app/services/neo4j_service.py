import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class Neo4jService:
    def __init__(self):
        self.uri = settings.NEO4J_URI
        self.user = settings.NEO4J_USER
        self.password = settings.NEO4J_PASSWORD
        self.driver = None

    def is_connected(self) -> bool:
        return self.driver is not None

    async def initialize(self):
        """
        Attempts connection to Neo4j graph database.
        """
        try:
            from neo4j import GraphDatabase
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            self.driver.verify_connectivity()
            logger.info("Neo4j driver connected successfully.")
        except Exception as e:
            logger.info(f"Neo4j Graph DB not active on {self.uri} ({e}). Using in-memory Evidence Graph representation.")
            self.driver = None

    def build_graph_structure(
        self,
        papers: List[Dict[str, Any]],
        claims: List[Dict[str, Any]],
        contradictions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Constructs a structured Evidence Knowledge Graph containing Nodes and Relationships:
        Nodes: Paper, Author, Claim, Evidence, Dataset, Method, Result
        Relationships: AUTHORED, CONTAINS_CLAIM, SUPPORTED_BY, CONTRADICTS, USES_DATASET, USES_METHOD, REPORTS_RESULT
        """
        nodes = []
        links = []
        node_ids = set()

        def add_node(id_: str, label: str, name: str, group: str, details: Dict[str, Any] = None):
            if id_ not in node_ids:
                node_ids.add(id_)
                nodes.append({
                    "id": id_,
                    "label": label,
                    "name": name,
                    "group": group,
                    "details": details or {}
                })

        def add_link(source: str, target: str, relationship: str, label: str = None):
            if source in node_ids and target in node_ids:
                links.append({
                    "source": source,
                    "target": target,
                    "relationship": relationship,
                    "label": label or relationship
                })

        # 1. Process Papers & Authors
        for p in papers:
            p_id = f"paper_{p.get('paper_id')}"
            add_node(p_id, "Paper", p.get("title", "Untitled Paper"), "paper", {
                "paper_id": p.get("paper_id"),
                "year": p.get("year"),
                "source": p.get("source"),
                "citation_count": p.get("citation_count"),
                "doi": p.get("doi"),
                "url": p.get("url")
            })

            # Authors
            authors = p.get("authors") or []
            for author_name in authors[:3]:
                a_id = f"author_{author_name.lower().replace(' ', '_')}"
                add_node(a_id, "Author", author_name, "author", {"name": author_name})
                add_link(a_id, p_id, "AUTHORED", "AUTHORED")

        # 2. Process Claims, Evidence, Dataset, Method, Result
        for c in claims:
            c_id = f"claim_{c.get('claim_id')}"
            p_id = f"paper_{c.get('paper_id')}"
            
            add_node(c_id, "Claim", c.get("statement", "Scientific Claim")[:60] + "...", "claim", {
                "claim_id": c.get("claim_id"),
                "statement": c.get("statement"),
                "verification_status": c.get("verification_status"),
                "confidence_score": c.get("confidence_score"),
                "explanation": c.get("explanation")
            })

            if p_id in node_ids:
                add_link(p_id, c_id, "CONTAINS_CLAIM", "CONTAINS_CLAIM")

            # Evidence Node
            ev_id = f"evidence_{c.get('claim_id')}"
            add_node(ev_id, "Evidence", f"Evidence ({c.get('verification_status')})", "evidence", {
                "evidence_text": c.get("evidence_text")
            })
            add_link(c_id, ev_id, "SUPPORTED_BY", "SUPPORTED_BY")

            # Dataset Node
            if c.get("dataset"):
                ds_id = f"dataset_{c.get('claim_id')}"
                add_node(ds_id, "Dataset", c.get("dataset"), "dataset", {"name": c.get("dataset")})
                add_link(c_id, ds_id, "USES_DATASET", "USES_DATASET")

            # Method Node
            if c.get("methodology"):
                m_id = f"method_{c.get('claim_id')}"
                add_node(m_id, "Method", c.get("methodology"), "method", {"name": c.get("methodology")})
                add_link(c_id, m_id, "USES_METHOD", "USES_METHOD")

            # Result Node
            if c.get("results"):
                res_id = f"result_{c.get('claim_id')}"
                add_node(res_id, "Result", c.get("results")[:40], "result", {"results": c.get("results")})
                add_link(c_id, res_id, "REPORTS_RESULT", "REPORTS_RESULT")

        # 3. Process Contradiction Relationships
        for contra in contradictions:
            c1_id = f"claim_{contra.get('claim_a_id')}"
            c2_id = f"claim_{contra.get('claim_b_id')}"
            
            if c1_id in node_ids and c2_id in node_ids:
                add_link(c1_id, c2_id, "CONTRADICTS", contra.get("type", "CONTRADICTS"))
            
            # Claim -> Contradicting Paper
            p_b_id = f"paper_{contra.get('paper_b_id')}"
            if c1_id in node_ids and p_b_id in node_ids:
                add_link(c1_id, p_b_id, "CONTRADICTS", "CONTRADICTED_BY_PAPER")

        return {"nodes": nodes, "links": links, "total_nodes": len(nodes), "total_links": len(links)}

neo4j_service = Neo4jService()
