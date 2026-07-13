import { Header } from "../components/Header";
import { DailyForms } from "../components/DailyForms";
import { useTracker } from "../contexts/TrackerContext";

export default function Daily() {
  const { today, updateDay } = useTracker();
  return <><Header title="Daily checklist" kicker="DSA, system design, AI learning, HR prep" /><DailyForms day={today} onChange={(patch) => updateDay(today.date, patch)} /></>;
}
