export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "LeetCode" | "Codeforces" | "CodeChef" | "GFG" | "HackerRank" | "Other";
export type Confidence = "Low" | "Medium" | "High";
export type Theme = "light" | "dark" | "system";

export type DayEntry = {
  date: string;
  dsa: { solved: number; target: number; difficulty: Difficulty; platform: Platform; notes: string };
  system: { title: string; url: string; read: boolean; notes: string };
  ai: { topic: string; title: string; url: string; completed: boolean; notes: string };
  hr: { question: string; practiced: boolean; confidence: Confidence };
  notes: string;
};

export type Settings = { appName: string; dsaTarget: number; theme: Theme; reminder: boolean };
export type TrackerState = { days: Record<string, DayEntry>; settings: Settings };
export type Badge = { id: string; title: string; hint: string; unlocked: boolean };
