import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TrackerProvider } from "./contexts/TrackerContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TrackSheet from "./pages/TrackSheet";
import Progress from "./pages/Progress";
import History from "./pages/History";
import Achievements from "./pages/Achievements";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <TrackerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="sheet" element={<TrackSheet />} />
            <Route path="daily" element={<Navigate to="/" replace />} />
            <Route path="progress" element={<Progress />} />
            <Route path="history" element={<History />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="stats" element={<Stats />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrackerProvider>
  );
}
