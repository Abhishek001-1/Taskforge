/* eslint-disable react-refresh/only-export-components */
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type React from "react";
import { defaultSettings, makeDay, mergeDay, normalizeState } from "../data/defaults";
import { pullState, pushState } from "../services/api";
import type { DayPatch, Settings, TrackerState } from "../types";
import { isDone } from "../utils/stats";

type Action =
  | { type: "day"; date: string; patch: DayPatch }
  | { type: "settings"; patch: Partial<Settings> }
  | { type: "replace"; state: TrackerState }
  | { type: "reset" };

/** Build a per-user localStorage key */
const storageKey = (userId: string) => `taskforge-state-${userId}`;
const legacyKey = "taskforge-state";
const olderLegacyKey = "careeros-state";

const loadInitial = (userId: string): TrackerState => {
  // Try per-user key first, then fall back to legacy (one-time migration)
  const saved =
    localStorage.getItem(storageKey(userId)) ??
    localStorage.getItem(legacyKey) ??
    localStorage.getItem(olderLegacyKey);
  return normalizeState(
    saved ? (JSON.parse(saved) as TrackerState) : { days: {}, settings: defaultSettings },
  );
};

function reducer(state: TrackerState, action: Action): TrackerState {
  if (action.type === "reset") {
    const today = format(new Date(), "yyyy-MM-dd");
    return { days: { [today]: makeDay(today) }, settings: defaultSettings };
  }
  if (action.type === "replace") return normalizeState(action.state);
  if (action.type === "settings") return { ...state, settings: { ...state.settings, ...action.patch } };
  const current = state.days[action.date] ?? makeDay(action.date, state.settings.dsaTarget);
  return { ...state, days: { ...state.days, [action.date]: mergeDay(current, action.patch) } };
}

const Ctx = createContext<ReturnType<typeof valueOf> | null>(null);

const valueOf = (state: TrackerState, dispatch: React.Dispatch<Action>) => {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const today = state.days[todayKey] ?? makeDay(todayKey, state.settings.dsaTarget);
  return {
    state,
    today,
    updateDay: (date: string, patch: DayPatch) => dispatch({ type: "day", date, patch }),
    updateSettings: (patch: Partial<Settings>) => dispatch({ type: "settings", patch }),
    replace: (next: TrackerState) => dispatch({ type: "replace", state: next }),
    reset: () => dispatch({ type: "reset" }),
  };
};

export function TrackerProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, userId, loadInitial);
  const value = useMemo(() => valueOf(state, dispatch), [state]);

  // Prevent pushing stale localStorage data before remote state is fetched
  const hasSynced = useRef(false);

  // Fetch remote state on mount (or when user changes)
  useEffect(() => {
    hasSynced.current = false;
    pullState().then((remote) => {
      if (remote) {
        dispatch({ type: "replace", state: remote });
      }
      hasSynced.current = true;
    });
  }, [userId]);

  // Persist to per-user localStorage & push to backend
  useEffect(() => {
    // Save to per-user key
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
    // Clean up legacy keys (one-time migration)
    localStorage.removeItem(legacyKey);
    localStorage.removeItem(olderLegacyKey);

    // Only push to backend after initial sync is done
    if (hasSynced.current) {
      pushState(state);
    }

    document.documentElement.classList.toggle(
      "dark",
      state.settings.theme === "dark" ||
        (state.settings.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }, [state, userId]);

  useEffect(() => {
    if (isDone(value.today)) confetti({ particleCount: 90, spread: 70, origin: { y: 0.75 } });
  }, [value.today]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTracker = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTracker must be used inside TrackerProvider");
  return ctx;
};

