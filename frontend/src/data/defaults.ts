import { format } from "date-fns";
import type { DayEntry, Settings } from "../types";

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
  notes: "",
});
