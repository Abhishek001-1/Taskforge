import { format } from "date-fns";
import { CheckCircle2, Flame, ListChecks, Target, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { DailyForms } from "../components/DailyForms";
import { Header } from "../components/Header";
import { Card, Progress, Stat } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { quotes } from "../data/defaults";
import { completion, dayScore, streaks, totals } from "../utils/stats";

export default function Dashboard() {
  const { state, today, updateDay } = useTracker();
  const t = totals(state), s = streaks(state), pct = completion(today), done = dayScore(today);
  return <>
    <Header title="Today's career operating system" kicker={format(new Date(), "EEEE, MMMM d")} />
    <Card className="mb-5 overflow-hidden bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm opacity-70">Daily signal</p><p className="mt-2 text-2xl font-bold">{quotes[new Date().getDate() % quotes.length]}</p></div><Link to="/daily" className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-zinc-950 dark:bg-zinc-950 dark:text-white">Open checklist</Link></div>
    </Card>
    <div className="grid gap-4 md:grid-cols-5"><Stat label="Completion" value={`${pct}%`} icon={<Target size={20} />} /><Stat label="Current streak" value={s.current} icon={<Flame size={20} />} /><Stat label="Days tracked" value={t.days} icon={<TimerReset size={20} />} /><Stat label="Completed" value={done} icon={<CheckCircle2 size={20} />} /><Stat label="Remaining" value={4 - done} icon={<ListChecks size={20} />} /></div>
    <Card className="my-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">Today</h2><span className="text-sm text-zinc-500">{done}/4 goals</span></div><Progress value={pct} /></Card>
    <DailyForms day={today} onChange={(patch) => updateDay(today.date, patch)} />
  </>;
}
