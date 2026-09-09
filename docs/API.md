# KnowSure REST & Webhook API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## 1. Research Pipeline Endpoints

### `POST /api/v1/research/submit`
Initiates an autonomous multi-agent research investigation.

**Request Body:**
```json
{
  "query": "Can large language models reliably detect misinformation across different languages and domains?",
  "max_papers": 10
}
```

**Response (200 OK):**
```json
{
  "session_id": "res_8f9a2b1c",
  "query": "Can large language models reliably detect misinformation across different languages and domains?",
  "current_stage": "PLANNING",
  "progress_percentage": 10.0,
  "papers_found_count": 0,
  "relevant_papers_count": 0,
  "claims_extracted_count": 0,
  "supported_claims_count": 0,
  "contradicted_claims_count": 0,
  "insufficient_claims_count": 0,
  "papers": [],
  "claims": [],
  "contradictions": [],
  "red_team_findings": [],
  "research_gaps": []
}
```

---

### `GET /api/v1/research/session/{session_id}`
Retrieves current telemetry, stage status, papers, claims, trust scores, and executive report for a research session.

---

## 2. Visual Research Endpoints

### `POST /api/v1/visual/analyze`
Generates an interactive visual plan for a research paper.

**Request Body:**
```json
{
  "paper": {
    "paper_id": "paper_123",
    "title": "Cross-Domain Misinformation Detection",
    "abstract": "Evaluation abstract text...",
    "year": 2024,
    "doi": "10.1016/j.knowsure.123"
  },
  "claims": [],
  "session_id": "session_abc"
}
```

**Response (200 OK):**
```json
{
  "session_id": "session_abc",
  "paper_id": "paper_123",
  "paper_title": "Cross-Domain Misinformation Detection",
  "concepts": [...],
  "opportunities": [...],
  "timeline": [...],
  "methodology_nodes": [...],
  "methodology_edges": [...],
  "evidence_nodes": [...],
  "evidence_edges": [...],
  "animation_schema": {
    "fps": 30,
    "total_duration_ms": 9500,
    "keyframes": [...]
  },
  "validation_passed": true,
  "validation_notes": ["All visual nodes verified."]
}
```

---

## 3. Evidence Knowledge Graph Endpoints

### `GET /api/v1/graph/session/{session_id}`
Queries Neo4j and returns graph elements (`nodes`, `edges`) for dynamic canvas rendering.

---

## 4. n8n Webhook Endpoint

### `POST /api/v1/n8n/webhook`
Receives external trigger webhooks from n8n automation workflows.
