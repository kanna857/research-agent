import re
from typing import List, Dict, Optional, Any
from app.schemas.research import ResearchPlan, ClarificationQuestion, ClarificationResponse

class ResearchPlannerAgent:
    async def generate_followup_questions(self, query: str) -> ClarificationResponse:
        """
        Analyzes the research query upfront before execution to generate 3 smart intake questions
        and 3 suggested query refinements to clarify user goals.
        """
        clean_q = query.strip()
        words = re.findall(r'\b[a-zA-Z0-9-]{3,}\b', clean_q)
        kw = words[0] if words else "target domain"

        questions = [
            ClarificationQuestion(
                id="target_scope",
                question=f"What evaluation scope should the investigation prioritize for '{clean_q[:50]}'?",
                options=[
                    "Empirical benchmarks & peer-reviewed papers only",
                    "Combined academic literature + technical web docs & open-source implementations",
                    "Specific language or cross-domain generalizability focus"
                ],
                suggested_default="Combined academic literature + technical web docs & open-source implementations"
            ),
            ClarificationQuestion(
                id="evidence_rigor",
                question="What evidence rigor standard is required for claim verification?",
                options=[
                    "Strict zero-tolerance (Require direct quantitative metrics & DOIs)",
                    "Balanced empirical synthesis (Include qualitative findings & case studies)",
                    "Exploratory review (Highlight open research gaps and unvalidated claims)"
                ],
                suggested_default="Strict zero-tolerance (Require direct quantitative metrics & DOIs)"
            ),
            ClarificationQuestion(
                id="comparison_dimension",
                question=f"Should the research compare specific architectures or baseline methods for {kw}?",
                options=[
                    "Compare proprietary commercial state-of-the-art models vs open-weight models",
                    "Compare supervised baseline methods vs zero-shot / few-shot prompting techniques",
                    "General empirical overview without architectural comparison"
                ],
                suggested_default="Compare proprietary commercial state-of-the-art models vs open-weight models"
            )
        ]

        refinements = [
            f"{clean_q} across cross-language benchmarks and adversarial datasets",
            f"Empirical comparative analysis of {clean_q} with quantitative failure rate metrics",
            f"Systematic literature review of {clean_q} examining reproducibility and dataset limitations"
        ]

        return ClarificationResponse(
            query=clean_q,
            followup_questions=questions,
            suggested_refinements=refinements
        )

    async def plan(
        self,
        query: str,
        breadth: int = 3,
        depth: int = 2,
        clarification_answers: Optional[Dict[str, str]] = None
    ) -> ResearchPlan:
        """
        Deconstructs research question into structured research plan with objectives,
        subquestions, targeted search queries, required evidence, and ambiguities,
        dynamically scaling with breadth and depth parameters.
        """
        clean_q = query.strip()
        
        # Extract key search keywords
        words = re.findall(r'\b[a-zA-Z0-9-]{3,}\b', clean_q)
        stopwords = {"can", "what", "does", "how", "with", "from", "that", "this", "across", "different", "which", "are", "were"}
        keywords = [w for w in words if w.lower() not in stopwords]
        kw_str = " ".join(keywords[:6]) if keywords else clean_q

        # Dynamically scale search queries based on breadth (1 to 8)
        base_queries = [
            clean_q,
            kw_str if kw_str != clean_q else f"{clean_q} empirical benchmark",
            f"{kw_str} evaluation limitations",
            f"{kw_str} state of the art results",
            f"{kw_str} failure modes and edge cases",
            f"{kw_str} cross domain generalization",
            f"{kw_str} dataset bias metrics",
            f"{kw_str} reproducibility analysis"
        ]
        search_queries = base_queries[:max(1, min(breadth, len(base_queries)))]

        # Dynamically scale subquestions based on depth (1 to 5)
        base_subquestions = [
            f"What empirical evidence exists regarding '{clean_q}'?",
            "What methodologies, datasets, and benchmarks are used to evaluate this claim in peer-reviewed literature?",
            "What direct contradictions, limitations, or failure modes are reported across studies?",
            f"How do results vary across different depth iteration levels (Depth Level 1-{depth})?",
            "What structural gaps, unvalidated assumptions, and future research directions remain?"
        ]
        subquestions = base_subquestions[:max(1, min(depth + 2, len(base_subquestions)))]

        required_evidence = [
            "Empirical accuracy, precision, F1-score, or detection rate metrics",
            "Cross-domain and multi-language benchmark evaluation datasets",
            "Reported paper limitations and dataset bias disclosures",
            f"Web crawl evidence and developer documentation (Breadth={breadth}, Depth={depth})"
        ]

        ambiguities = [
            "Variations in benchmark metric definitions across studies",
            "Model architecture differences (e.g., proprietary LLMs vs open-weights models)"
        ]

        if clarification_answers:
            for k, v in clarification_answers.items():
                ambiguities.append(f"User Intake Preference [{k}]: {v}")

        return ResearchPlan(
            objective=f"Empirically investigate research question: '{clean_q}' (Breadth={breadth}, Depth={depth})",
            subquestions=subquestions,
            search_queries=search_queries,
            required_evidence=required_evidence,
            ambiguities=ambiguities,
            breadth=breadth,
            depth=depth
        )

planner_agent = ResearchPlannerAgent()
