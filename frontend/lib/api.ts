import { ResearchStatus } from "@/types/research";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function startResearch(query: string, maxPapers: number = 10): Promise<ResearchStatus> {
  const res = await fetch(`${API_BASE}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, max_papers: maxPapers }),
  });
  if (!res.ok) {
    throw new Error(`Failed to initialize research session: ${res.statusText}`);
  }
  return res.json();
}

export async function getResearchStatus(sessionId: string): Promise<ResearchStatus> {
  const res = await fetch(`${API_BASE}/research/${sessionId}`, {
    cache: "no-store"
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch session status: ${res.statusText}`);
  }
  return res.json();
}
