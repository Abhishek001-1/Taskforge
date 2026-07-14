import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Card, GhostButton, Input, Progress } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { cn } from "../utils/cn";
import { completion } from "../utils/stats";

export default function History() {
  const { state } = useTracker();
  const [selected, setSelected] = useState(format(new Date(), "yyyy-MM-dd"));
  const [q, setQ] = useState("");
  const month = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
  const day = state.days[selected];
  const hits = useMemo(() => Object.values(state.days).filter((d) => JSON.stringify(d).toLowerCase().includes(q.toLowerCase())).slice(0, 8), [state.days, q]);
  return <><Header title="History" kicker="Calendar, search, and daily review" /><div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><Card><div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">{"SMTWTFS".split("").map((d, i) => <span key={i}>{d}</span>)}</div><div className="grid grid-cols-7 gap-2">{Array.from({ length: getDay(month[0]) }).map((_, i) => <span key={i} />)}{month.map((d) => { const key = format(d, "yyyy-MM-dd"), pct = completion(state.days[key]); return <button key={key} onClick={() => setSelected(key)} className={cn("aspect-square rounded-2xl border border-[#ddd9f0] bg-[#f6f5fc] p-2 text-left text-sm transition hover:border-[#5b5ce2] dark:border-white/10 dark:bg-white/5", selected === key && "border-[#5b5ce2] bg-white ring-2 ring-[#5b5ce2]/20 dark:border-indigo-300 dark:bg-indigo-500/10")}><span className="font-bold">{format(d, "d")}</span><Progress value={pct} className="mt-3 h-1.5" /></button>; })}</div></Card><Card><h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">{selected}</h2>{day ? <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-zinc-300"><p>DSA: <b className="text-slate-900 dark:text-zinc-50">{day.dsa.solved}</b> on {day.dsa.platform} ({day.dsa.difficulty})</p><p>System article: <b className="text-slate-900 dark:text-zinc-50">{day.system.read ? day.system.title || "Read" : "Pending"}</b></p><p>AI article: <b className="text-slate-900 dark:text-zinc-50">{day.ai.completed ? day.ai.title || day.ai.topic : "Pending"}</b></p><p>Behavioral: <b className="text-slate-900 dark:text-zinc-50">{day.hr.practiced ? day.hr.confidence : "Pending"}</b></p><p>Misc: <b className="text-slate-900 dark:text-zinc-50">{day.misc.completed ? day.misc.notes || "Done" : "Pending"}</b></p><p className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-white/5 dark:text-zinc-300">{day.notes || "No notes yet."}</p></div> : <p className="mt-4 text-slate-500">No entry for this date yet.</p>}</Card></div><Card className="mt-5"><div className="mb-3 flex items-center gap-2 text-slate-600"><Search size={18} /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes, articles, questions..." /></div>{q && <div className="flex flex-wrap gap-2">{hits.map((d) => <GhostButton key={d.date} onClick={() => setSelected(d.date)}>{d.date}</GhostButton>)}</div>}</Card></>;
}
