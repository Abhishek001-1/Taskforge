import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, CalendarDays, Grid3X3, Home, LogOut, Medal, Moon, Settings, Sparkles, Sun, Trophy } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTracker } from "../contexts/TrackerContext";
import { cn } from "../utils/cn";

const nav = [
  ["/", Home, "Dashboard"],
  ["/sheet", Grid3X3, "Track Sheet"],
  ["/progress", BarChart3, "Progress"],
  ["/history", CalendarDays, "History"],
  ["/achievements", Trophy, "Badges"],
  ["/stats", Medal, "Stats"],
  ["/settings", Settings, "Settings"],
] as const;

function ThemeToggle() {
  const { state, updateSettings } = useTracker();
  const isDark = state.settings.theme === "dark" || (state.settings.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const toggle = () => updateSettings({ theme: isDark ? "light" : "dark" });

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-2xl border transition-all duration-200",
        "border-[#cdc9ee] bg-white text-[#5b5ce2] hover:bg-[#ede9ff] hover:shadow-[0_2px_8px_rgb(91_92_226/0.18)]",
        "dark:border-white/10 dark:bg-white/8 dark:text-[#a5b4fc] dark:hover:bg-white/15",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
            <Sun size={16} />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
            <Moon size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Layout() {
  const { state } = useTracker();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div
      className="min-h-screen overflow-x-hidden text-[#1a1b2e] dark:text-zinc-50"
      style={{
        background: "var(--bg)",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 10% -10%, rgb(91 92 226 / 0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 5%, rgb(61 139 253 / 0.09) 0%, transparent 55%)",
        // NOTE: no backgroundAttachment:fixed — it breaks position:fixed on mobile browsers
      }}
    >
      {/* ── Mobile top bar (hidden on desktop) ──────── */}
      <header className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 h-14",
        "border-b border-[#d5d2f0] bg-white/90 backdrop-blur-xl",
        "dark:border-white/[0.07] dark:bg-[#0f1020]/95",
        "md:hidden", // only on mobile
      )}>
        {/* App name */}
        <div className="flex items-center gap-2">
          <div
            className="rounded-xl p-1.5 text-white"
            style={{ background: "linear-gradient(135deg, #5b5ce2, #3d8bfd)" }}
          >
            <Sparkles size={14} />
          </div>
          <span className="text-sm font-bold text-[#1a1b2e] dark:text-zinc-50">{state.settings.appName}</span>
        </div>
        {/* Theme toggle + logout — top-right on mobile */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => logout()}
            aria-label="Log out"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-2xl border transition-all duration-200",
              "border-[#cdc9ee] bg-white text-[#5b5ce2] hover:bg-red-50 hover:text-red-500 hover:border-red-200",
              "dark:border-white/10 dark:bg-white/8 dark:text-[#a5b4fc] dark:hover:bg-red-500/15 dark:hover:text-red-400",
            )}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Desktop sidebar ──────────────────────────── */}
      <aside
        className={cn(
          // Mobile: bottom fixed nav — flush to edges, no gap
          "fixed inset-x-0 bottom-0 z-50",
          "border-t border-[#d5d2f0] px-1 py-2",
          "shadow-[0_-4px_20px_rgb(91_92_226/0.12)] dark:shadow-[0_-4px_20px_rgb(0_0_0/0.5)]",
          // Desktop: left sidebar with blur + rounded
          "md:inset-x-auto md:inset-y-4 md:left-4 md:right-auto md:w-60 md:rounded-3xl md:border md:border-[#d5d2f0] md:p-4 md:backdrop-blur-2xl",
          "md:bg-white/85 md:dark:bg-[#0f1020]/90",
          "md:shadow-[0_8px_32px_rgb(91_92_226/0.15)] md:dark:shadow-[0_8px_40px_rgb(0_0_0/0.55)]",
        )}
        style={{
          // Solid opaque bg on mobile — cannot bleed or scroll away
          backgroundColor: (state.settings.theme === "dark" || (state.settings.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)) ? "#0f1020" : "#ffffff",
        }}
      >
        {/* Desktop logo */}
        <div className="mb-6 hidden items-center gap-3 px-2 md:flex">
          <div
            className="rounded-2xl p-2.5 text-white"
            style={{ background: "linear-gradient(135deg, #5b5ce2, #3d8bfd)", boxShadow: "0 4px 14px rgb(91 92 226 / 0.45)" }}
          >
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#1a1b2e] dark:text-zinc-50 truncate">{state.settings.appName}</p>
            <p className="text-xs font-medium text-[#7175a0] dark:text-zinc-500">Daily prep tracker</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex justify-around md:grid md:grid-cols-1 md:gap-1">
          {nav.map(([to, Icon, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => cn(
                "group flex items-center justify-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-all duration-200 md:rounded-2xl md:px-3 md:py-2.5 md:justify-start",
                isActive
                  ? "bg-gradient-to-br from-[#5b5ce2] to-[#4546c8] text-white shadow-[0_4px_14px_rgb(91_92_226/0.40)] dark:from-[#8183f4] dark:to-[#5b5ce2]"
                  : "text-[#7175a0] hover:bg-[#ede9ff] hover:text-[#5b5ce2] dark:text-zinc-500 dark:hover:bg-white/8 dark:hover:text-zinc-200",
              )}
            >
              {({ isActive }) => (
                <>
                  <span className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-105")}>
                    <Icon size={17} />
                  </span>
                  <span className="hidden md:inline">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop bottom: user info + logout */}
        <div className="mt-auto hidden pt-6 md:block space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#5b5ce2]/8 to-[#3d8bfd]/8 p-3 dark:from-white/5 dark:to-white/3">
            <p className="text-xs font-semibold text-[#5b5ce2] dark:text-indigo-300 truncate">{user?.name || user?.email || "User"}</p>
            <p className="mt-0.5 text-[10px] text-[#9397bc] dark:text-zinc-600 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-[#7175a0] hover:bg-red-50 hover:text-red-500 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400",
            )}
          >
            <LogOut size={17} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Desktop theme toggle — fixed top-right ───── */}
      <div className="fixed right-4 top-4 z-40 hidden md:block">
        <ThemeToggle />
      </div>

      {/* ── Main content ─────────────────────────────── */}
      {/* pt-14 on mobile to clear the top bar, pt-5 on desktop */}
      <main className="mx-auto max-w-7xl px-3 pb-20 pt-16 md:ml-64 md:px-8 md:pb-10 md:pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
