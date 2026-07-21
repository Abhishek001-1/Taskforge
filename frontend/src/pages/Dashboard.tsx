import { useState } from "react";
import { format } from "date-fns";
import { ArrowRight, CheckCircle2, Clock, Flame, ListChecks, Sparkles, Target, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DailyForms } from "../components/DailyForms";
import { Header } from "../components/Header";
import { ResumeCard } from "../components/ResumeCard";
import { AiSuggestionsModal } from "../components/AiSuggestionsModal";
import { Badge, Card, Progress, Stat } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { quotes } from "../data/defaults";
import { completion, dayScore, streaks, totals } from "../utils/stats";
import type { AiGoal } from "../types";
import type { SuggestionItem } from "../services/aiTypes";

export default function Dashboard() {
  const { state, today, updateDay } = useTracker();
  const t = totals(state);
  const s = streaks(state);
  const pct = completion(today);
  const done = dayScore(today);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [resumeHighlight, setResumeHighlight] = useState(false);

  const handleAddGoals = (goals: SuggestionItem[]) => {
    const addedAt = new Date().toISOString();
    updateDay(today.date, {
      aiGoals: [
        ...(today.aiGoals ?? []),
        ...goals.map((goal): AiGoal => ({ ...goal, added_at: addedAt })),
      ],
    });
  };

  const focusResumeUpload = () => {
    setSuggestionsOpen(false);
    setResumeHighlight(true);
    requestAnimationFrame(() =>
      document.getElementById("resume-profile")?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
    window.setTimeout(() => setResumeHighlight(false), 2200);
  };

  return (
    <>
      <Header title="Today" kicker={format(new Date(), "EEEE, MMMM d")} />

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
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgb(255 255 255 / 0.3) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgb(167 139 250 / 0.6) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-200">Today's focus</p>
            <p className="mt-2 max-w-xl text-xl font-bold leading-snug text-white">
              {quotes[new Date().getDate() % quotes.length]}
            </p>
            <p className="mt-2 text-sm text-indigo-200/80">Saved locally. Changes sync across all views.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setSuggestionsOpen(true)}
              className="group inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg active:scale-[0.97]"
            >
              <Sparkles size={16} className="transition-transform group-hover:scale-110" />
              Suggest with AI
            </button>
            <Link
              to="/sheet"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:shadow-lg"
            >
              Open Track Sheet
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <Stat label="Completion" value={`${pct}%`} icon={<Target size={20} />} tone={0} />
        <Stat label="Current streak" value={s.current} icon={<Flame size={20} />} tone={2} />
        <Stat label="Days tracked" value={t.days} icon={<TimerReset size={20} />} tone={1} />
        <Stat label="Done today" value={done} icon={<CheckCircle2 size={20} />} tone={3} />
        <Stat label="Remaining" value={5 - done} icon={<ListChecks size={20} />} tone={4} />
      </div>

      <Card className="my-5 border-[#d5d2f0] dark:border-white/[0.08]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#1a1b2e] dark:text-zinc-50">Today's progress</h2>
            <p className="mt-0.5 text-xs text-[#7175a0] dark:text-zinc-500">{done} of 5 goals completed</p>
          </div>
          <span className="text-2xl font-extrabold" style={{ color: pct === 100 ? "#10b981" : pct >= 60 ? "#f97316" : "#5b5ce2" }}>
            {pct}%
          </span>
        </div>
        <Progress value={pct} className="h-3" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{ background: i < done ? "linear-gradient(90deg, #5b5ce2, #3d8bfd)" : "rgb(91 92 226 / 0.12)" }}
            />
          ))}
        </div>
      </Card>

      <div id="resume-profile" className={`mb-5 rounded-3xl transition ${resumeHighlight ? "ring-4 ring-indigo-400/60" : ""}`}>
        <ResumeCard />
      </div>

      {today.aiGoals?.length > 0 && (
        <Card className="mb-5 border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#1a1b2e] dark:text-zinc-50">Today's AI goals</h2>
            <Badge tone={1}>{today.aiGoals.length} added</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {today.aiGoals.map((goal, i) => (
              <div key={`${goal.added_at}-${goal.title}-${i}`} className="rounded-2xl border border-[#e8e5f8] bg-[#f9f8ff] p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-[#1a1b2e] dark:text-zinc-100">{goal.title}</p>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#9397bc] dark:text-zinc-500">
                    <Clock size={12} />
                    {goal.estimated_minutes}m
                  </span>
                </div>
                <Badge tone={1} className="text-[10px]">{goal.category}</Badge>
                <p className="mt-2 text-xs leading-relaxed text-[#7175a0] dark:text-zinc-400">{goal.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <DailyForms day={today} onChange={(patch) => updateDay(today.date, patch)} />

      <AiSuggestionsModal
        open={suggestionsOpen}
        onClose={() => setSuggestionsOpen(false)}
        onAddGoals={handleAddGoals}
        onUploadResume={focusResumeUpload}
      />
    </>
  );
}
