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
  misc: { completed: boolean; notes: string };
  notes: string;
};

export type Settings = { appName: string; dsaTarget: number; theme: Theme; reminder: boolean };
export type TrackerState = { days: Record<string, DayEntry>; settings: Settings };
export type Badge = { id: string; title: string; hint: string; unlocked: boolean };

/** Sparse day update — nested keys merge; omitted fields keep prior values. */
export type DayPatch = {
  [K in keyof DayEntry]?: DayEntry[K] extends object ? Partial<DayEntry[K]> : DayEntry[K];
};
