import { Header } from "../components/Header";
import { Stat } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { totals } from "../utils/stats";

export default function Stats() {
  const t = totals(useTracker().state);
  const stats = [["Total DSA solved", t.dsa], ["Easy solved", t.easy], ["Medium solved", t.medium], ["Hard solved", t.hard], ["System Design Articles Read", t.system], ["AI Articles Read", t.ai], ["HR Questions Practiced", t.hr], ["Average daily completion", `${t.avg}%`], ["Current streak", t.current], ["Longest streak", t.longest]];
  return <><Header title="Statistics" kicker="Your complete prep inventory" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{stats.map(([label, value]) => <Stat key={label} label={String(label)} value={value} />)}</div></>;
}
