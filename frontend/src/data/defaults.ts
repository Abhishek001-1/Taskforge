import { format } from "date-fns";
import type { DayEntry, Settings } from "../types";

export const aiTopics = ["GenAI", "LLMs", "Agentic AI", "MCP", "RAG", "LangChain", "LangGraph", "AI Agents", "Prompt Engineering", "OpenAI", "Vector Databases", "Evaluation"];
export const platforms = ["LeetCode", "Codeforces", "CodeChef", "GFG", "HackerRank", "Other"] as const;
export const difficulties = ["Easy", "Medium", "Hard"] as const;
export const quotes = [
  "Small daily reps become interview calm.",
  "Consistency compounds faster than panic ever can.",
  "Today is a clean build. Ship one useful increment.",
  "Prepare like your future self already has the offer.",
];

export const defaultSettings: Settings = { appName: "CareerOS", dsaTarget: 5, theme: "system", reminder: true };

export const makeDay = (date = format(new Date(), "yyyy-MM-dd"), target = 5): DayEntry => ({
  date,
  dsa: { solved: 0, target, difficulty: "Medium", platform: "LeetCode", notes: "" },
  system: { title: "", url: "", read: false, notes: "" },
  ai: { topic: "LLMs", title: "", url: "", completed: false, notes: "" },
  hr: { question: "", practiced: false, confidence: "Medium" },
  notes: "",
});
