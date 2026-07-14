import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TrackerProvider } from "./contexts/TrackerContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TrackSheet from "./pages/TrackSheet";
import Progress from "./pages/Progress";
import History from "./pages/History";
import Achievements from "./pages/Achievements";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-3 border-t-transparent"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <TrackerProvider userId={user.id}>
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

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
