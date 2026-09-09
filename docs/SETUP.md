# KnowSure Installation & Setup Guide

## 1. Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) Qdrant Vector Store instance (`localhost:6333` or in-memory fallback)
- (Optional) Neo4j Graph Database (`bolt://localhost:7687` or mock fallback)

---

## 2. Quickstart Instructions

### Step 1: Clone Repository & Configure Environment
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
APP_NAME=KnowSure
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./knowsure.db
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
OPENAI_API_KEY=your_openai_api_key_here
```

---

### Step 2: Install Backend Dependencies & Start FastAPI Server
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend server will run on `http://127.0.0.1:8000`. Documentation will be available at `http://127.0.0.1:8000/docs`.

---

### Step 3: Install Frontend Dependencies & Start Next.js Development Server
```bash
cd frontend
npm install
npm run dev
```

The frontend application will be live at `http://localhost:3000`.

---

## 3. Running Automated Tests

### Run Backend Pytest Suite (21 Tests)
```bash
cd backend
pytest
```

### Run Frontend Type Check & Production Build
```bash
cd frontend
npx tsc --noEmit
npm run build
```
