import { Header } from "../components/Header";
import { MonthlyMatrix } from "../components/MonthlyMatrix";
import { useTracker } from "../contexts/TrackerContext";

export default function TrackSheet() {
  const { state, updateDay } = useTracker();
  return (
    <>
      <Header title="Track Sheet" kicker="Month-wide checklist · tick what you completed" />
      <MonthlyMatrix state={state} onChange={updateDay} />
    </>
  );
}
