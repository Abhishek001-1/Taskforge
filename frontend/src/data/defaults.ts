import { format } from "date-fns";
import type { Confidence, DayEntry, DayPatch, Difficulty, Platform, Settings, TrackerState } from "../types";

export const aiTopics = ["GenAI", "LLMs", "Agentic AI", "MCP", "RAG", "LangChain", "LangGraph", "AI Agents", "Prompt Engineering", "OpenAI", "Vector Databases", "Evaluation"];
export const platforms = ["LeetCode", "Codeforces", "CodeChef", "GFG", "HackerRank", "Other"] as const;
export const difficulties = ["Easy", "Medium", "Hard"] as const;
export const quotes = [
  "Today's progress is tomorrow's confidence.",
  "Solve. Learn. Practice. Repeat.",
  "One focused session beats hours of distraction.",
  "Consistency compounds faster than intensity.",
  "Build your interview skills—one task at a time.",
  "Every completed goal is another step toward your dream role.",
  "Stay curious. Stay disciplined. Stay interview-ready.",
];

export const defaultSettings: Settings = { appName: "TaskForge", dsaTarget: 5, theme: "system", reminder: true };

export const makeDay = (date = format(new Date(), "yyyy-MM-dd"), target = 5): DayEntry => ({
  date,
  dsa: { solved: 0, target, difficulty: "Medium", platform: "LeetCode", notes: "" },
  system: { title: "", url: "", read: false, notes: "" },
  ai: { topic: "LLMs", title: "", url: "", completed: false, notes: "" },
  hr: { question: "", practiced: false, confidence: "Medium" },
  misc: { completed: false, notes: "" },
  notes: "",
});

/** Blank form values — never prefilled from saved day data. */
export type DayFormDraft = {
  dsa: { solved: string; difficulty: string; platform: string; notes: string };
  system: { title: string; url: string; read: boolean; notes: string };
  ai: { topic: string; title: string; url: string; completed: boolean; notes: string };
  hr: { question: string; practiced: boolean; confidence: string };
  misc: { completed: boolean; notes: string };
  notes: string;
};

export const blankDraft = (): DayFormDraft => ({
  dsa: { solved: "", difficulty: "", platform: "", notes: "" },
  system: { title: "", url: "", read: false, notes: "" },
  ai: { topic: "", title: "", url: "", completed: false, notes: "" },
  hr: { question: "", practiced: false, confidence: "" },
  misc: { completed: false, notes: "" },
  notes: "",
});

const filled = (v: string) => v.trim().length > 0;

/** Build a sparse patch from the blank form so empty fields never wipe prior saves. */
export function draftToPatch(draft: DayFormDraft, target: number): DayPatch | null {
  const patch: DayPatch = {};

  if (draft.dsa.solved !== "" || filled(draft.dsa.notes) || draft.dsa.difficulty || draft.dsa.platform) {
    patch.dsa = {
      target,
      ...(draft.dsa.solved !== "" ? { solved: Math.max(0, Number(draft.dsa.solved) || 0) } : {}),
      ...(draft.dsa.difficulty ? { difficulty: draft.dsa.difficulty as Difficulty } : {}),
      ...(draft.dsa.platform ? { platform: draft.dsa.platform as Platform } : {}),
      ...(filled(draft.dsa.notes) ? { notes: draft.dsa.notes.trim() } : {}),
    };
  }

  if (filled(draft.system.title) || filled(draft.system.url) || draft.system.read || filled(draft.system.notes)) {
    patch.system = {
      ...(filled(draft.system.title) ? { title: draft.system.title.trim() } : {}),
      ...(filled(draft.system.url) ? { url: draft.system.url.trim() } : {}),
      ...(draft.system.read ? { read: true } : {}),
      ...(filled(draft.system.notes) ? { notes: draft.system.notes.trim() } : {}),
    };
  }

  if (draft.ai.topic || filled(draft.ai.title) || filled(draft.ai.url) || draft.ai.completed || filled(draft.ai.notes)) {
    patch.ai = {
      ...(draft.ai.topic ? { topic: draft.ai.topic } : {}),
      ...(filled(draft.ai.title) ? { title: draft.ai.title.trim() } : {}),
      ...(filled(draft.ai.url) ? { url: draft.ai.url.trim() } : {}),
      ...(draft.ai.completed ? { completed: true } : {}),
      ...(filled(draft.ai.notes) ? { notes: draft.ai.notes.trim() } : {}),
    };
  }

  if (filled(draft.hr.question) || draft.hr.practiced || draft.hr.confidence) {
    patch.hr = {
      ...(filled(draft.hr.question) ? { question: draft.hr.question.trim() } : {}),
      ...(draft.hr.practiced ? { practiced: true } : {}),
      ...(draft.hr.confidence ? { confidence: draft.hr.confidence as Confidence } : {}),
    };
  }

  if (draft.misc.completed || filled(draft.misc.notes)) {
    patch.misc = {
      ...(draft.misc.completed ? { completed: true } : {}),
      ...(filled(draft.misc.notes) ? { notes: draft.misc.notes.trim() } : {}),
    };
  }

  if (filled(draft.notes)) patch.notes = draft.notes.trim();

  return Object.keys(patch).length ? patch : null;
}

export function mergeDay(current: DayEntry, patch: DayPatch): DayEntry {
  return {
    ...current,
    ...patch,
    date: current.date,
    dsa: { ...current.dsa, ...patch.dsa },
    system: { ...current.system, ...patch.system },
    ai: { ...current.ai, ...patch.ai },
    hr: { ...current.hr, ...patch.hr },
    misc: { ...current.misc, ...patch.misc },
  };
}

export function normalizeState(raw?: Partial<TrackerState> | null): TrackerState {
  const today = format(new Date(), "yyyy-MM-dd");
  const settings = { ...defaultSettings, ...raw?.settings };
  const days = Object.fromEntries(Object.entries(raw?.days ?? {}).map(([date, day]) => {
    const base = makeDay(date, settings.dsaTarget);
    return [date, mergeDay(base, day ?? {})];
  }));
  days[today] ??= makeDay(today, settings.dsaTarget);
  return { days, settings };
}
