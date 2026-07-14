import { Award, Lock } from "lucide-react";
import { Header } from "../components/Header";
import { Card } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { cn } from "../utils/cn";
import { badges } from "../utils/stats";

export default function Achievements() {
  const { state } = useTracker();
  return <><Header title="Achievements" kicker="Badges unlock as your prep compounds" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{badges(state).map((b) => <Card key={b.id} className={b.unlocked ? "bg-gradient-to-br from-white to-[#ecebff]" : "opacity-70"}><div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-white", b.unlocked ? "bg-gradient-to-br from-[#5b5ce2] to-[#3d8bfd]" : "bg-slate-300 dark:bg-zinc-700")}>{b.unlocked ? <Award size={22} /> : <Lock size={22} />}</div><h2 className="text-lg font-bold">{b.title}</h2><p className="mt-2 text-sm text-slate-500">{b.hint}</p><p className="mt-4 text-sm font-semibold text-[#5b5ce2] dark:text-indigo-300">{b.unlocked ? "Unlocked" : "Locked"}</p></Card>)}</div></>;
}
