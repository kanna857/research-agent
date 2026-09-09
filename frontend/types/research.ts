export type VerificationStatus = 
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "CONTRADICTED"
  | "INSUFFICIENT_EVIDENCE";

export type ConfidenceLevel = 
  | "HIGH_CONFIDENCE"
  | "MODERATE_CONFIDENCE"
  | "UNCERTAIN"
  | "INSUFFICIENT_EVIDENCE";

export type WorkflowStage = 
  | "IDLE"
  | "PLANNING"
  | "RETRIEVAL"
  | "RANKING"
  | "EVIDENCE_EXTRACTION"
  | "CLAIM_VERIFICATION"
  | "CONTRADICTION_DETECTION"
  | "TRUST_ANALYSIS"
  | "RED_TEAM"
  | "RESEARCH_GAPS"
  | "JUDGE"
  | "SYNTHESIS"
  | "FIREWALL"
  | "COMPLETED"
  | "FAILED";

export type ResearchMode = 
  | "QUICK_RESEARCH"
  | "DEEP_RESEARCH"
  | "LITERATURE_REVIEW"
  | "PAPER_RANKING"
  | "PAPER_AUDIT"
  | "REPLICATION_ANALYSIS"
  | "RESEARCH_COMPARISON"
  | "RESEARCH_GAP_FINDER";

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  suggested_default: string;
}

export interface ClarificationResponse {
  query: string;
  followup_questions: ClarificationQuestion[];
  suggested_refinements: string[];
}

export interface PaperRankBreakdown {
  relevance_score: number;
  citation_score: number;
  methodology_score: number;
  reproducibility_score: number;
  provenance_score: number;
  recency_score: number;
  evidence_quality_score: number;
  overall_rank_score: number;
  ranking_explanation: string;
}

export interface PaperAuditResult {
  paper_id: string;
  traceability_chain: string[];
  mismatches_found: string[];
  audit_passed: boolean;
}

export interface ReplicationAnalysisResult {
  paper_id: string;
  main_experiment: string;
  required_datasets: string[];
  methods: string[];
  metrics: string[];
  implementation_requirements: string[];
  reproducibility_score: number;
  sufficient_info_available: boolean;
  missing_information: string[];
}

export interface Paper {
  id: string;
  paper_id: string;
  title: string;
  authors: string[];
  year?: number;
  abstract?: string;
  doi?: string;
  url?: string;
  source: string;
  citation_count: number;
  reproducibility_score?: number;
  bias_score?: number;
  rank_breakdown?: PaperRankBreakdown;
  audit_result?: PaperAuditResult;
  replication_analysis?: ReplicationAnalysisResult;
}

export interface Claim {
  id: string;
  claim_id: string;
  statement: string;
  paper_id: string;
  paper_title?: string;
  evidence_text: string;
  methodology?: string;
  dataset?: string;
  sample_size?: string;
  metrics?: string;
  results?: string;
  limitations?: string;
  verification_status: VerificationStatus;
  confidence_score: number;
  explanation: string;
  contradicting_claim_ids?: string[];
}

export interface Contradiction {
  contradiction_id: string;
  claim_a_id: string;
  claim_b_id: string;
  paper_a_id: string;
  paper_b_id: string;
  type: string;
  description: string;
}

export interface TrustScoreBreakdown {
  evidence_quality: number;
  source_reliability: number;
  independent_agreement: number;
  methodology_quality: number;
  reproducibility: number;
  citation_support: number;
}

export interface TrustAnalysis {
  overall_trust_score: number;
  confidence_level: ConfidenceLevel;
  breakdown: TrustScoreBreakdown;
  explanation: string;
  knowns: string[];
  unknowns: string[];
  missing_evidence: string[];
}

export interface RedTeamFinding {
  category: string;
  challenge: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  target_claim_id?: string;
}

export interface ResearchGap {
  gap_id: string;
  title: string;
  description: string;
  understudied_area: string;
  connected_paper_ids: string[];
}

export interface FinalJudgement {
  status: ConfidenceLevel;
  main_conclusion: string;
  reasoning: string;
  firewall_passed: boolean;
  firewall_revisions?: string[];
}

export interface ResearchStatus {
  session_id: string;
  query: string;
  current_stage: WorkflowStage;
  progress_percentage: number;
  papers_found_count: number;
  relevant_papers_count: number;
  claims_extracted_count: number;
  supported_claims_count: number;
  contradicted_claims_count: number;
  insufficient_claims_count: number;
  plan?: {
    objective: string;
    subquestions: string[];
    search_queries: string[];
    required_evidence: string[];
    ambiguities: string[];
    breadth?: number;
    depth?: number;
  };
  papers: Paper[];
  claims: Claim[];
  contradictions: Contradiction[];
  trust_analysis?: TrustAnalysis;
  red_team_findings: RedTeamFinding[];
  research_gaps: ResearchGap[];
  final_judgement?: FinalJudgement;
  report_markdown?: string;
  error?: string;
}

export interface VisualConcept {
  concept_id: string;
  name: string;
  concept_type: "ENTITY" | "VARIABLE" | "METRIC" | "DATASET" | "METHOD";
  description: string;
  evidence_snippet: string;
  paper_id?: string;
}

export interface VisualOpportunity {
  opportunity_id: string;
  visual_type: "METHODOLOGY_FLOW" | "RESEARCH_TIMELINE" | "EVIDENCE_NETWORK" | "CONCEPT_MATRIX";
  confidence: number;
  justification: string;
}

export interface TimelineMilestone {
  milestone_id: string;
  year_or_date: string;
  title: string;
  description: string;
  paper_id?: string;
  doi?: string;
}

export interface DiagramNode {
  node_id: string;
  label: string;
  node_type: "INPUT" | "PROCESS" | "MODEL" | "OUTPUT" | "CLAIM" | "EVIDENCE";
  description: string;
  paper_id?: string;
  evidence_text?: string;
}

export interface DiagramEdge {
  edge_id: string;
  source_id: string;
  target_id: string;
  label: string;
  relationship_type: "FEEDS_INTO" | "PRODUCES" | "SUPPORTS" | "CONTRADICTS";
}

export interface AnimationKeyframe {
  frame_index: number;
  step_title: string;
  description: string;
  active_node_ids: string[];
  camera_focus: string;
  duration_ms: number;
}

export interface AnimationSchema {
  fps: number;
  total_duration_ms: number;
  keyframes: AnimationKeyframe[];
}

export interface VisualResearchPlan {
  session_id: string;
  paper_id: string;
  paper_title: string;
  concepts: VisualConcept[];
  opportunities: VisualOpportunity[];
  timeline: TimelineMilestone[];
  methodology_nodes: DiagramNode[];
  methodology_edges: DiagramEdge[];
  evidence_nodes: DiagramNode[];
  evidence_edges: DiagramEdge[];
  animation_schema: AnimationSchema;
  validation_passed: boolean;
  validation_notes: string[];
}
