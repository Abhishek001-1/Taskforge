import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, subMonths } from "date-fns";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { makeDay } from "../data/defaults";
import type { DayPatch, TrackerState } from "../types";
import { cn } from "../utils/cn";
import { dayScore } from "../utils/stats";
import { GhostButton, Progress } from "./ui";

type Props = {
  state: TrackerState;
  onChange: (date: string, patch: DayPatch) => void;
};

const columns = [
  { id: "dsa",    label: "DSA",       color: "#5b5ce2", glow: "rgb(91 92 226 / 0.4)" },
  { id: "system", label: "Sys Design", color: "#3d8bfd", glow: "rgb(61 139 253 / 0.4)" },
  { id: "ai",     label: "AI",        color: "#a78bfa", glow: "rgb(167 139 250 / 0.4)" },
  { id: "hr",     label: "Behavioral", color: "#f97316", glow: "rgb(249 115 22 / 0.4)" },
  { id: "misc",   label: "Misc",      color: "#10b981", glow: "rgb(16 185 129 / 0.4)" },
] as const;

type TrackId = (typeof columns)[number]["id"];

export function MonthlyMatrix({ state, onChange }: Props) {
  const [cursor, setCursor] = useState(() => new Date());
  const today = new Date();
  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) }),
    [cursor],
  );

  const getDay = (date: string) => state.days[date] ?? makeDay(date, state.settings.dsaTarget);

  const monthScore = useMemo(() => {
    const scores = days.map((d) => dayScore(getDay(format(d, "yyyy-MM-dd"))));
    const total = scores.reduce((a, b) => a + b, 0);
    const possible = days.length * 5;
    return { total, pct: possible ? Math.round((total / possible) * 100) : 0 };
  }, [days, state.days, state.settings.dsaTarget]);

  const toggled = (date: string, track: TrackId, checked: boolean): DayPatch => {
    const day = getDay(date);
    if (track === "dsa")    return { dsa:    { solved: checked ? day.dsa.target : 0 } };
    if (track === "system") return { system: { read: checked } };
    if (track === "ai")     return { ai:     { completed: checked } };
    if (track === "hr")     return { hr:     { practiced: checked } };
    return { misc: { completed: checked } };
  };

  const flags = (date: string) => {
    const day = getDay(date);
    return {
      dsa:    day.dsa.solved >= day.dsa.target,
      system: day.system.read,
      ai:     day.ai.completed,
      hr:     day.hr.practiced,
      misc:   day.misc.completed,
      score:  dayScore(day),
    } as const;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-3xl border",
        // Light: solid white with rich shadow
        "border-[#d5d2f0] bg-white shadow-[0_4px_24px_rgb(91_92_226/0.12)] ring-1 ring-inset ring-white/60",
        // Dark: deep panel
        "dark:border-white/[0.08] dark:bg-[#111221] dark:shadow-[0_8px_40px_rgb(0_0_0/0.45)] dark:ring-white/[0.03]",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between",
          "border-[#e2dff5] bg-gradient-to-br from-white to-[#f4f3fc]",
          "dark:border-white/[0.07] dark:from-[#111221] dark:to-[#141530]",
        )}
      >
        <div>
          <h2 className="text-xl font-extrabold text-[#1a1b2e] dark:text-zinc-50">Monthly coverage</h2>
          <p className="mt-0.5 text-sm text-[#7175a0] dark:text-zinc-500">
            Tap a cell to mark or clear. Changes save immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Progress */}
          <div className="min-w-44">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-[#7175a0] dark:text-zinc-500">
              <span>Month completion</span>
              <span
                className="font-bold"
                style={{
                  color: monthScore.pct > 60 ? "#10b981" : monthScore.pct > 30 ? "#f97316" : "#5b5ce2",
                }}
              >
                {monthScore.pct}%
              </span>
            </div>
            <Progress value={monthScore.pct} className="h-2" />
          </div>

          {/* Nav */}
          <div className="flex items-center gap-2">
            <GhostButton
              type="button"
              aria-label="Previous month"
              onClick={() => setCursor((d) => subMonths(d, 1))}
            >
              <ChevronLeft size={18} />
            </GhostButton>
            <div className="min-w-36 text-center text-sm font-bold text-[#1a1b2e] dark:text-zinc-100">
              {format(cursor, "MMMM yyyy")}
            </div>
            <GhostButton
              type="button"
              aria-label="Next month"
              onClick={() => setCursor((d) => addMonths(d, 1))}
            >
              <ChevronRight size={18} />
            </GhostButton>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr
              className={cn(
                "sticky top-0 z-10",
                "bg-[#f0eeff]/95 backdrop-blur dark:bg-[#0f1020]/95",
              )}
            >
              <th className="w-36 px-5 py-3.5 text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7175a0] dark:text-zinc-500">
                  Date
                </span>
              </th>
              {columns.map((col) => (
                <th key={col.id} className="px-3 py-3.5 text-center">
                  <span
                    className="inline-flex rounded-lg px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                    style={{
                      background: `${col.color}18`,
                      color: col.color,
                    }}
                  >
                    {col.label}
                  </span>
                </th>
              ))}
              <th className="w-44 px-5 py-3.5 text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7175a0] dark:text-zinc-500">
                  Completion
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((date, rowIdx) => {
              const key = format(date, "yyyy-MM-dd");
              const row = flags(key);
              const isToday = isSameDay(date, today);
              return (
                <motion.tr
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIdx * 0.01, duration: 0.2 }}
                  className={cn(
                    "border-t transition-colors",
                    "border-[#ebe8f8] hover:bg-[#f0eeff]",
                    "dark:border-white/[0.06] dark:hover:bg-white/[0.035]",
                    isToday && "bg-[#5b5ce2]/[0.055] dark:bg-indigo-500/[0.08]",
                  )}
                >
                  {/* Date cell */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-bold text-[#1a1b2e] dark:text-zinc-50">
                          {format(date, "d MMM")}
                        </div>
                        <div className="text-xs text-[#7175a0] dark:text-zinc-500">
                          {format(date, "EEE")}
                        </div>
                      </div>
                      {isToday && (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
                          style={{
                            background: "rgb(91 92 226 / 0.12)",
                            color: "#5b5ce2",
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Track cells */}
                  {columns.map((col) => {
                    const on = row[col.id];
                    return (
                      <td key={col.id} className="px-3 py-3 text-center">
                        <button
                          type="button"
                          aria-pressed={on}
                          aria-label={`${col.label} ${key}`}
                          onClick={() => onChange(key, toggled(key, col.id, !on))}
                          className={cn(
                            "mx-auto flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 active:scale-90",
                            on
                              ? "border-transparent text-white"
                              : [
                                  "border-[#d8d5f4] bg-[#f4f3fc] text-transparent",
                                  "hover:border-[#b0acdf] hover:bg-[#ede9ff]",
                                  "dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10",
                                ].join(" "),
                          )}
                          style={
                            on
                              ? {
                                  background: `linear-gradient(135deg, ${col.color}, ${col.color}cc)`,
                                  boxShadow: `0 3px 10px ${col.glow}`,
                                }
                              : undefined
                          }
                        >
                          <Check
                            size={15}
                            strokeWidth={3}
                            className={cn("transition-opacity duration-200", on ? "opacity-100" : "opacity-0")}
                          />
                        </button>
                      </td>
                    );
                  })}

                  {/* Completion cell */}
                  <td className="px-5 py-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#7175a0] dark:text-zinc-500">{row.score}/5</span>
                      <span
                        style={{
                          color:
                            row.score === 5
                              ? "#10b981"
                              : row.score >= 3
                                ? "#f97316"
                                : "#7175a0",
                        }}
                      >
                        {row.score * 20}%
                      </span>
                    </div>
                    <Progress value={row.score * 20} className="h-1.5" />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
