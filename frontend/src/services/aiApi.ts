import type { SuggestionItem } from "./aiTypes";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("taskforge-token");
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export interface ResumeAnalysis {
  skills?: string[];
  programming_languages?: string[];
  frameworks?: string[];
  tools?: string[];
  projects?: { name: string; description: string }[];
  experience?: { role: string; company: string; duration: string }[];
  education?: { degree: string; institution: string; year: string }[];
  domains?: string[];
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  career_summary?: string;
}

export interface ResumeData {
  id: string;
  filename: string;
  analysis: ResumeAnalysis | null;
  created_at: string;
  updated_at: string;
}

/** Upload PDF resume — multipart/form-data */
export async function uploadResume(file: File): Promise<ResumeData> {
  const form = new FormData();
  form.append("file", file);
  const r = await fetch(`${API}/ai/resume/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return r.json();
}

/** Get current user's resume analysis */
export async function getResume(): Promise<ResumeData | null> {
  const r = await fetch(`${API}/ai/resume`, { headers: authHeaders() });
  if (r.status === 404) return null;
  if (!r.ok) return null;
  return r.json();
}

/** Delete current user's resume */
export async function deleteResume(): Promise<void> {
  await fetch(`${API}/ai/resume`, { method: "DELETE", headers: authHeaders() });
}

/** Generate AI suggestions based on resume + tracker state */
export async function getSuggestions(): Promise<SuggestionItem[]> {
  const r = await fetch(`${API}/ai/suggestions`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: "Suggestions failed" }));
    throw new Error(err.detail || "Could not generate suggestions");
  }
  const data = await r.json();
  return data.suggestions;
}
