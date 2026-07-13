/* eslint-disable react-refresh/only-export-components */
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type React from "react";
import { defaultSettings, makeDay } from "../data/defaults";
import { pullState, pushState } from "../services/api";
import type { DayEntry, Settings, TrackerState } from "../types";
import { isDone } from "../utils/stats";

type Action =
  | { type: "day"; date: string; patch: Partial<DayEntry> }
  | { type: "settings"; patch: Partial<Settings> }
  | { type: "replace"; state: TrackerState }
  | { type: "reset" };

const key = "careeros-state";
const initial = (): TrackerState => {
  const saved = localStorage.getItem(key);
  const base = saved ? JSON.parse(saved) as TrackerState : { days: {}, settings: defaultSettings };
  const today = format(new Date(), "yyyy-MM-dd");
  base.settings = { ...defaultSettings, ...base.settings };
  base.days[today] ??= makeDay(today, base.settings.dsaTarget);
  return base;
};

function reducer(state: TrackerState, action: Action): TrackerState {
  if (action.type === "reset") return { days: { [format(new Date(), "yyyy-MM-dd")]: makeDay(format(new Date(), "yyyy-MM-dd")) }, settings: defaultSettings };
  if (action.type === "replace") return action.state;
  if (action.type === "settings") return { ...state, settings: { ...state.settings, ...action.patch } };
  const current = state.days[action.date] ?? makeDay(action.date, state.settings.dsaTarget);
  return { ...state, days: { ...state.days, [action.date]: { ...current, ...action.patch } } };
}

const Ctx = createContext<ReturnType<typeof valueOf> | null>(null);
const valueOf = (state: TrackerState, dispatch: React.Dispatch<Action>) => ({
  state,
  today: state.days[format(new Date(), "yyyy-MM-dd")],
  updateDay: (date: string, patch: Partial<DayEntry>) => dispatch({ type: "day", date, patch }),
  updateSettings: (patch: Partial<Settings>) => dispatch({ type: "settings", patch }),
  replace: (state: TrackerState) => dispatch({ type: "replace", state }),
  reset: () => dispatch({ type: "reset" }),
});

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, initial);
  const value = useMemo(() => valueOf(state, dispatch), [state]);
  useEffect(() => { pullState().then((remote) => remote && dispatch({ type: "replace", state: remote })); }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state)); pushState(state);
    document.documentElement.classList.toggle("dark", state.settings.theme === "dark" || (state.settings.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches));
  }, [state]);
  useEffect(() => { if (isDone(value.today)) confetti({ particleCount: 90, spread: 70, origin: { y: .75 } }); }, [value.today]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTracker = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTracker must be used inside TrackerProvider");
  return ctx;
};
