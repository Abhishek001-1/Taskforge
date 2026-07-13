import { CompletionArea, DsaLine, PeriodBars } from "../components/Charts";
import { Header } from "../components/Header";
import { Card, Stat } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import { chartData, periodData, totals } from "../utils/stats";

export default function Progress() {
  const { state } = useTracker();
  const t = totals(state), data = chartData(state);
  return <><Header title="Progress" kicker="Daily, weekly, monthly, and DSA trends" /><div className="grid gap-4 md:grid-cols-3"><Stat label="Current streak" value={t.current} /><Stat label="Longest streak" value={t.longest} /><Stat label="Average completion" value={`${t.avg}%`} /></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="xl:col-span-2"><h2 className="mb-4 text-xl font-bold">Daily completion</h2><CompletionArea data={data} /></Card><Card><h2 className="mb-4 text-xl font-bold">Weekly progress</h2><PeriodBars data={periodData(state, "week")} /></Card><Card><h2 className="mb-4 text-xl font-bold">Monthly progress</h2><PeriodBars data={periodData(state, "month")} /></Card><Card className="xl:col-span-2"><h2 className="mb-4 text-xl font-bold">DSA solved trend</h2><DsaLine data={data} /></Card></div></>;
}
