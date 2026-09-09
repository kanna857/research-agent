# KnowSure — Autonomous AI Research Intelligence Platform

> **"AI that investigates what the evidence actually supports."**

KnowSure is a production-quality research intelligence platform designed to conduct rigorous academic literature investigations, extract claim-level evidence, detect paper-to-paper contradictions, calculate transparent Trust and Uncertainty Scores, perform red-team analysis, identify research gaps, and generate evidence-backed research reports protected by a final Evidence Firewall.

---

## 🎯 Core Principles

1. **Zero Hallucination Tolerance**: Every claim MUST be backed by retrieved literature.
2. **Explicit Insufficient Evidence**: If evidence is missing, KnowSure explicitly states `"INSUFFICIENT EVIDENCE"` and explains why.
3. **Transparent Trust & Uncertainty Scoring**: Fully explainable multi-factor scoring metrics.
4. **Adversarial Red-Team & Judge Architecture**: Hypothesis challenging before synthesis.
5. **Decoupled Workflow Orchestration**: Integrates with **n8n** via secure HTTP webhooks with fallback Python orchestration.

---

## 🏗 System Architecture

```
KnowSure/
├── backend/            # FastAPI Python 3.11+ async service
│   └── app/
│       ├── api/        # REST endpoints & n8n webhook handlers
│       ├── agents/     # Research Planner, Verifier, Contradiction Engine, Red Team, Judge
│       ├── services/   # OpenAlex, Semantic Scholar, arXiv, Qdrant, Neo4j, n8n integration
│       ├── database/   # Async SQLAlchemy / PostgreSQL & SQLite session handlers
│       ├── schemas/    # Pydantic data contracts
│       ├── core/       # Settings & Security
│       └── main.py     # Application entry point
├── frontend/           # Next.js 14+ (App Router, Tailwind CSS, TypeScript)
├── database/           # PostgreSQL init scripts & Neo4j schema Cypher scripts
├── evaluation/         # Benchmark datasets & claim validation evaluation runner
├── n8n/                # n8n Research Orchestrator workflow specs (.json)
├── docker/             # Docker compose configurations for PG, Qdrant, Neo4j, n8n
├── docs/               # System documentation & API specifications
└── scripts/            # Development automation scripts
```

---

## 🚀 Quick Start (Development)

### 1. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the KnowSure Research Intelligence Platform.

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
pytest
```

### Evaluation Benchmark
```bash
python evaluation/run_evaluation.py
```

---

## 🔒 Security & Privacy
- API keys are managed exclusively via environment variables (`.env`).
- Frontend never communicates with external academic APIs directly; all requests flow through backend security filters.
- All webhook calls from n8n are authenticated via secret headers (`X-N8N-API-Key`).
