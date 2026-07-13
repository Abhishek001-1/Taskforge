import { addDays, differenceInCalendarDays, eachDayOfInterval, format, parseISO, startOfMonth, startOfWeek, subDays } from "date-fns";
import type { Badge, DayEntry, TrackerState } from "../types";

export const dayScore = (d: DayEntry) => [d.dsa.solved >= d.dsa.target, d.system.read, d.ai.completed, d.hr.practiced].filter(Boolean).length;
export const completion = (d?: DayEntry) => (d ? Math.round((dayScore(d) / 4) * 100) : 0);
export const isDone = (d?: DayEntry) => !!d && completion(d) === 100;
export const allDays = (s: TrackerState) => Object.values(s.days).sort((a, b) => a.date.localeCompare(b.date));

export function streaks(s: TrackerState) {
  const days = allDays(s).filter(isDone).map((d) => d.date);
  const set = new Set(days);
  let current = 0, cursor = format(new Date(), "yyyy-MM-dd");
  while (set.has(cursor)) { current++; cursor = format(subDays(parseISO(cursor), 1), "yyyy-MM-dd"); }
  let longest = 0, run = 0, prev = "";
  for (const date of days) {
    run = prev && differenceInCalendarDays(parseISO(date), parseISO(prev)) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run); prev = date;
  }
  return { current, longest };
}

export function totals(s: TrackerState) {
  const days = allDays(s);
  const dsa = days.reduce((n, d) => n + d.dsa.solved, 0);
  return {
    days: days.length, dsa,
    easy: days.filter((d) => d.dsa.difficulty === "Easy").reduce((n, d) => n + d.dsa.solved, 0),
    medium: days.filter((d) => d.dsa.difficulty === "Medium").reduce((n, d) => n + d.dsa.solved, 0),
    hard: days.filter((d) => d.dsa.difficulty === "Hard").reduce((n, d) => n + d.dsa.solved, 0),
    system: days.filter((d) => d.system.read).length,
    ai: days.filter((d) => d.ai.completed).length,
    hr: days.filter((d) => d.hr.practiced).length,
    avg: days.length ? Math.round(days.reduce((n, d) => n + completion(d), 0) / days.length) : 0,
    ...streaks(s),
  };
}

export const chartData = (s: TrackerState, count = 30) => eachDayOfInterval({ start: subDays(new Date(), count - 1), end: new Date() }).map((date) => {
  const key = format(date, "yyyy-MM-dd"), d = s.days[key];
  return { date: format(date, "MMM d"), completion: completion(d), dsa: d?.dsa.solved ?? 0 };
});

export const periodData = (s: TrackerState, period: "week" | "month") => {
  const start = period === "week" ? startOfWeek(new Date()) : startOfMonth(new Date());
  return eachDayOfInterval({ start, end: addDays(new Date(), 0) }).map((date) => {
    const key = format(date, "yyyy-MM-dd");
    return { date: format(date, period === "week" ? "EEE" : "d"), completion: completion(s.days[key]) };
  });
};

export const badges = (s: TrackerState): Badge[] => {
  const t = totals(s);
  const items: Array<[string, string, string, boolean]> = [
    ["7", "7 Day Streak", "Complete every goal for 7 days", t.longest >= 7],
    ["30", "30 Day Streak", "Build a full month of momentum", t.longest >= 30],
    ["100d", "100 DSA Solved", "Solve 100 total problems", t.dsa >= 100],
    ["500d", "500 DSA Solved", "Solve 500 total problems", t.dsa >= 500],
    ["100a", "100 Articles Read", "Read 100 system or AI articles", t.system + t.ai >= 100],
    ["ready", "Interview Ready", "Unlock a balanced prep profile", t.dsa >= 150 && t.system >= 30 && t.ai >= 30 && t.hr >= 30],
  ];
  return items.map(([id, title, hint, unlocked]) => ({ id, title, hint, unlocked }));
};
