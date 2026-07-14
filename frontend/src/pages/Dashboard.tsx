import { format } from "date-fns";
import { CheckCircle2, Flame, ListChecks, Target, TimerReset, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DailyForms } from "../components/DailyForms";
import { Header } from "../components/Header";
import { Card, Progress, Stat } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { quotes } from "../data/defaults";
import { completion, dayScore, streaks, totals } from "../utils/stats";

export default function Dashboard() {
  const { state, today, updateDay } = useTracker();
  const t = totals(state);
  const s = streaks(state);
  const pct = completion(today);
  const done = dayScore(today);

  return (
    <>
      <Header title="Today" kicker={format(new Date(), "EEEE, MMMM d")} />

      {/* ── Hero banner ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-5 overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #4a4be0 0%, #5b5ce2 40%, #3d8bfd 100%)",
          boxShadow: "0 8px 32px rgb(91 92 226 / 0.40), 0 1px 0 rgb(255 255 255 / 0.15) inset",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgb(255 255 255 / 0.3) 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgb(167 139 250 / 0.6) 0%, transparent 70%)" }}
        />

        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-200">Today's focus</p>
            <p className="mt-2 max-w-xl text-xl font-bold text-white leading-snug">
              {quotes[new Date().getDate() % quotes.length]}
            </p>
            <p className="mt-2 text-sm text-indigo-200/80">
              Saved locally · Changes sync across all views.
            </p>
          </div>
          <Link
            to="/sheet"
            className="group shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:shadow-lg"
          >
            Open Track Sheet
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* ── Stat cards ──────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <Stat label="Completion"      value={`${pct}%`}      icon={<Target size={20} />}       tone={0} />
        <Stat label="Current streak"  value={s.current}       icon={<Flame size={20} />}        tone={2} />
        <Stat label="Days tracked"    value={t.days}          icon={<TimerReset size={20} />}   tone={1} />
        <Stat label="Done today"      value={done}            icon={<CheckCircle2 size={20} />} tone={3} />
        <Stat label="Remaining"       value={5 - done}        icon={<ListChecks size={20} />}   tone={4} />
      </div>

      {/* ── Progress card ───────────────────────── */}
      <Card className="my-5 border-[#d5d2f0] dark:border-white/[0.08]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#1a1b2e] dark:text-zinc-50">Today's progress</h2>
            <p className="mt-0.5 text-xs text-[#7175a0] dark:text-zinc-500">
              {done} of 5 goals completed
            </p>
          </div>
          <span
            className="text-2xl font-extrabold"
            style={{
              color: pct === 100 ? "#10b981" : pct >= 60 ? "#f97316" : "#5b5ce2",
            }}
          >
            {pct}%
          </span>
        </div>
        <Progress value={pct} className="h-3" />

        {/* Goal pips */}
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background:
                  i < done
                    ? "linear-gradient(90deg, #5b5ce2, #3d8bfd)"
                    : "rgb(91 92 226 / 0.12)",
              }}
            />
          ))}
        </div>
      </Card>

      {/* ── Daily form ──────────────────────────── */}
      <DailyForms day={today} onChange={(patch) => updateDay(today.date, patch)} />
    </>
  );
}
