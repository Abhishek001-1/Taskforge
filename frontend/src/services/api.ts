import type { TrackerState } from "../types";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function pullState(): Promise<TrackerState | null> {
  try {
    const r = await fetch(`${API}/state`);
    return r.ok ? r.json() : null;
  } catch { return null; }
}

export async function pushState(state: TrackerState) {
  try {
    await fetch(`${API}/state`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) });
  } catch { /* offline-first: localStorage remains source of truth */ }
}
