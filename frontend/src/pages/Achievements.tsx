import { Award, Lock } from "lucide-react";
import { Header } from "../components/Header";
import { Card } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { badges } from "../utils/stats";

export default function Achievements() {
  const { state } = useTracker();
  return <><Header title="Achievements" kicker="Badges unlock as your prep compounds" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{badges(state).map((b) => <Card key={b.id} className={b.unlocked ? "bg-emerald-50/80 dark:bg-emerald-950/20" : "opacity-70"}><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">{b.unlocked ? <Award /> : <Lock />}</div><h2 className="text-xl font-bold">{b.title}</h2><p className="mt-2 text-sm text-zinc-500">{b.hint}</p><p className="mt-4 text-sm font-bold">{b.unlocked ? "Unlocked" : "Locked"}</p></Card>)}</div></>;
}
