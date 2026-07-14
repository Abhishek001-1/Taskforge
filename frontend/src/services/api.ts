import type { TrackerState } from "../types";
import { getToken } from "./auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function pullState(): Promise<TrackerState | null> {
  try {
    const r = await fetch(`${API}/state`, { headers: authHeaders() });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export async function pushState(state: TrackerState) {
  try {
    await fetch(`${API}/state`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(state) });
  } catch { /* offline-first: localStorage remains source of truth */ }
}
