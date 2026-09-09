import re
from typing import List
from app.schemas.research import ResearchPlan

class ResearchPlannerAgent:
    async def plan(self, query: str) -> ResearchPlan:
        """
        Deconstructs research question into structured research plan with objectives,
        subquestions, targeted search queries, required evidence, and ambiguities.
        """
        clean_q = query.strip()
        
        # Extract key search keywords
        words = re.findall(r'\b[a-zA-Z0-9-]{3,}\b', clean_q)
        stopwords = {"can", "what", "does", "how", "with", "from", "that", "this", "across", "different", "which", "are", "were"}
        keywords = [w for w in words if w.lower() not in stopwords]
        kw_str = " ".join(keywords[:6]) if keywords else clean_q

        search_queries = [
            clean_q,
            kw_str if kw_str != clean_q else f"{clean_q} empirical benchmark",
            f"{kw_str} evaluation limitations"
        ]
        
        subquestions = [
            f"What empirical evidence exists regarding '{clean_q}'?",
            "What methodologies, datasets, and benchmarks are used to evaluate this claim in peer-reviewed literature?",
            "What direct contradictions, limitations, or failure modes are reported across studies?"
        ]
        
        required_evidence = [
            "Empirical accuracy, precision, F1-score, or detection rate metrics",
            "Cross-domain and multi-language benchmark evaluation datasets",
            "Reported paper limitations and dataset bias disclosures"
        ]
        
        ambiguities = [
            "Variations in benchmark metric definitions across studies",
            "Model architecture differences (e.g., proprietary LLMs vs open-weights models)"
        ]

        return ResearchPlan(
            objective=f"Empirically investigate research question: '{clean_q}'",
            subquestions=subquestions,
            search_queries=search_queries,
            required_evidence=required_evidence,
            ambiguities=ambiguities
        )

planner_agent = ResearchPlannerAgent()
