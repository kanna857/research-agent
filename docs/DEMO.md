# KnowSure End-to-End Walkthrough & Demonstration Guide

This guide provides step-by-step instructions to demonstrate the **KnowSure** platform end-to-end.

---

## 1. Test Research Question

Use the following real scientific research question:
> **"Can large language models reliably detect misinformation across different languages and domains?"**

---

## 2. Step-by-Step Demonstration Flow

### Step 1: Submit Research Question
1. Open the KnowSure Research Workspace in your browser (`http://localhost:3000`).
2. Type the test question into the input field.
3. Select `Max Papers: 10`.
4. Click **"Initiate Autonomous Investigation"**.

### Step 2: Observe Real-Time Telemetry & Progress Tracker
- Watch the **Research Progress Tracker** advance through 7 pipeline stages:
  1. `PLANNING`: Formulating search queries and evidence requirements.
  2. `RETRIEVAL`: Querying OpenAlex, Semantic Scholar, and arXiv APIs.
  3. `EVIDENCE_EXTRACTION`: Chunking literature and extracting claim-level units.
  4. `GRAPH_CONSTRUCTION`: Building the Neo4j Evidence Knowledge Graph.
  5. `CONTRADICTION_DETECTION`: Analyzing cross-paper variances.
  6. `TRUST_ANALYSIS`: Calculating the 6-factor Trust Score.
  7. `RED_TEAM & JUDGE`: Executing adversarial attacks and rendering the final verdict.

### Step 3: Inspect Academic Paper Explorer (`Papers` Tab)
1. Click the **Papers** tab.
2. Review normalized paper metadata (OpenAlex, Semantic Scholar, arXiv).
3. Observe publication years, DOIs, citation counts, and abstracts.
4. Click **"Visual Research"** on any paper card to trigger the Visual Research Module.

### Step 4: Explore Visual Research Module (`Visual Research Modal`)
1. Observe the 6-stage visual pipeline:
   `Paper → Analyze → Identify concepts → Create visual plan → Generate visualization → Validate → Display`
2. Navigate between interactive visual tabs:
   - **Methodology Diagram**: Click flowchart nodes to inspect backing paper evidence chunks.
   - **Research Timeline**: View chronological milestone developments with DOIs.
   - **Evidence Network**: Inspect claim-to-chunk relationship nodes.
   - **Interactive Step Playback**: Click **"Play Step Flow"** to step through the dynamic explanation.
   - **Future Animation Spec**: Inspect the JSON `AnimationSchema` for Manim/Remotion renderers.

### Step 5: Explore Evidence Knowledge Graph (`Evidence Graph` Tab)
1. Click the **Evidence Graph** tab.
2. Interact with the Neo4j canvas:
   - Node Types: `Paper` (cyan), `Claim` (emerald), `Evidence` (purple), `Dataset` (amber), `Method` (indigo), `Result` (pink).
   - Click any node to view real-time properties in the Node Attributes Inspector.

### Step 6: Inspect Claim-Level Provenance & Status Badges (`Claims` Tab)
1. Click the **Claims** tab.
2. Filter claims by status:
   - `✓ Evidence Verified` (emerald badge)
   - `⚠ Needs Review` (amber badge)
   - `✕ Unsupported Claim` (rose badge)
3. Inspect statement, confidence score, evidence text snippet, sample size, and citation provenance.

### Step 7: Review Contradictions & Trust Analysis (`Contradictions` & `Trust Score` Tabs)
1. Click **Contradictions** to view side-by-side claim variations across literature.
2. Click **Trust Score** to view the transparent formula breakdown across Evidence Quality, Source Reliability, Independent Agreement, Methodology, Reproducibility, and Citation Support.

### Step 8: View Final Verdict & Executive Synthesis (`Judge Verdict` & `Executive Report`)
1. Click **Judge Verdict** to review the master verdict classification (`SUPPORTED`, `PARTIALLY_SUPPORTED`, `UNCERTAIN`, `INSUFFICIENT_EVIDENCE`), main conclusion, and reasoning.
2. Click **Executive Report** to view the final synthesis certified by the **KnowSure Final Evidence Firewall**.
3. Click **"Export Markdown"** to download the report locally.
