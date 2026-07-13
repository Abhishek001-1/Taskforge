import { BarChart3, CalendarDays, CheckSquare, Home, Medal, Settings, Sparkles, Trophy } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useTracker } from "../contexts/TrackerContext";
import { cn } from "../utils/cn";

const nav = [
  ["/", Home, "Dashboard"], ["/daily", CheckSquare, "Daily"], ["/progress", BarChart3, "Progress"],
  ["/history", CalendarDays, "History"], ["/achievements", Trophy, "Badges"], ["/stats", Medal, "Stats"], ["/settings", Settings, "Settings"],
] as const;

export function Layout() {
  const { state } = useTracker();
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ff,transparent_32%),linear-gradient(135deg,#fbfbfc,#eef1f5_45%,#f8fafc)] text-zinc-950 dark:bg-[radial-gradient(circle_at_top_left,#173042,transparent_30%),linear-gradient(135deg,#07080b,#111318_55%,#09090b)] dark:text-zinc-50">
    <aside className="fixed inset-x-3 bottom-3 z-30 rounded-3xl border border-white/60 bg-white/80 p-2 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80 md:inset-y-4 md:left-4 md:right-auto md:w-64 md:p-4">
      <div className="mb-6 hidden items-center gap-3 px-2 md:flex"><div className="rounded-2xl bg-zinc-950 p-2 text-white dark:bg-white dark:text-zinc-950"><Sparkles size={20} /></div><div><p className="text-lg font-black">{state.settings.appName}</p><p className="text-xs text-zinc-500">Daily interview cockpit</p></div></div>
      <nav className="grid grid-cols-7 gap-1 md:grid-cols-1">
        {nav.map(([to, Icon, label]) => <NavLink key={to} to={to} className={({ isActive }) => cn("flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-white/10 md:justify-start", isActive && "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950")}>
          <Icon size={18} /><span className="hidden md:inline">{label}</span>
        </NavLink>)}
      </nav>
    </aside>
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 md:ml-72 md:px-8 md:pb-10">
      <Outlet />
    </main>
  </div>;
}
