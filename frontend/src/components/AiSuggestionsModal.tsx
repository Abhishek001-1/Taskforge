import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Clock, RefreshCw, Plus, CheckSquare } from "lucide-react";
import { Button, GhostButton, Badge } from "./ui";
import type { SuggestionItem } from "../services/aiTypes";
import { getSuggestions } from "../services/aiApi";

const categoryTone: Record<string, number> = {
  DSA: 0,
  "System Design": 1,
  Backend: 1,
  "AI/ML": 4,
  HR: 2,
  Project: 3,
  Revision: 0,
};

/* ── Shimmer rows ─────────────────────────────────────────── */
function ShimmerRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#e8e5f8] bg-[#f9f8ff] p-4 dark:border-white/5 dark:bg-white/[0.02]"
        >
          <div className="h-4 w-3/4 rounded bg-[#e8e5f8] dark:bg-white/10 mb-2" />
          <div className="h-3 w-1/2 rounded bg-[#e8e5f8] dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}

/* ── Suggestion row ───────────────────────────────────────── */
function SuggestionRow({
  item,
  selected,
  onToggle,
}: {
  item: SuggestionItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const tone = categoryTone[item.category] ?? 0;
  return (
    <motion.label
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
        selected
          ? "border-[#5b5ce2] bg-[#ede9ff] shadow-[0_2px_8px_rgb(91_92_226/0.15)] dark:border-indigo-500 dark:bg-indigo-500/10"
          : "border-[#e8e5f8] bg-white hover:border-[#cdc9ee] hover:shadow-sm dark:border-white/[0.06] dark:bg-[#111221] dark:hover:border-white/10"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="mt-1 shrink-0 accent-[#5b5ce2]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-[#1a1b2e] dark:text-zinc-100">
            {item.title}
          </span>
          <Badge tone={tone} className="text-[10px]">{item.category}</Badge>
        </div>
        <p className="mt-1 text-xs text-[#7175a0] dark:text-zinc-400 leading-relaxed">
          {item.description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#9397bc] dark:text-zinc-500">
        <Clock size={12} />
        {item.estimated_minutes}m
      </div>
    </motion.label>
  );
}

/* ── Modal ────────────────────────────────────────────────── */
export function AiSuggestionsModal({
  open,
  onClose,
  onAddGoals,
  onUploadResume,
}: {
  open: boolean;
  onClose: () => void;
  onAddGoals: (goals: SuggestionItem[]) => void;
  onUploadResume: () => void;
}) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    setSuggestions([]);
    setSelected(new Set());
    try {
      const items = await getSuggestions();
      setSuggestions(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when opened
  useEffect(() => {
    if (open && suggestions.length === 0 && !loading) {
      fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleItem = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === suggestions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(suggestions.map((_, i) => i)));
    }
  };

  const handleAdd = (indices: number[]) => {
    onAddGoals(indices.map((i) => suggestions[i]));
    onClose();
    setSuggestions([]);
    setSelected(new Set());
  };

  const needsResume = /upload.*resume|resume.*first/i.test(error);

  return (
    <AnimatePresence onExitComplete={() => { /* cleanup */ }}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}

        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-[#d5d2f0] bg-white shadow-[0_24px_80px_rgb(91_92_226/0.25)] dark:border-white/[0.08] dark:bg-[#111221] dark:shadow-[0_24px_80px_rgb(0_0_0/0.6)]"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#e8e5f8] px-6 py-4 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #5b5ce2, #3d8bfd)",
                    boxShadow: "0 4px 14px rgb(91 92 226 / 0.45)",
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">
                    AI Goal Suggestions
                  </h3>
                  <p className="text-xs text-[#9397bc] dark:text-zinc-500">
                    Personalized based on your resume & activity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#7175a0] transition-colors hover:bg-[#ede9ff] hover:text-[#5b5ce2] dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loading && <ShimmerRows />}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                  {needsResume && (
                    <div className="mt-3">
                      <Button type="button" onClick={onUploadResume} className="px-3 py-2 text-xs">
                        Upload Resume
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!loading && !error && suggestions.length === 0 && (
                <div className="flex flex-col items-center py-8 text-center">
                  <Sparkles size={32} className="text-[#cdc9ee] dark:text-zinc-600 mb-3" />
                  <p className="text-sm text-[#9397bc] dark:text-zinc-500">
                    Click to generate AI-powered suggestions
                  </p>
                </div>
              )}

              {suggestions.map((item, i) => (
                <SuggestionRow
                  key={`${item.title}-${i}`}
                  item={item}
                  selected={selected.has(i)}
                  onToggle={() => toggleItem(i)}
                />
              ))}
            </div>

            {/* Modal footer */}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e5f8] px-6 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <GhostButton onClick={selectAll}>
                    <CheckSquare size={14} />
                    {selected.size === suggestions.length ? "Deselect All" : "Select All"}
                  </GhostButton>
                  <span className="text-xs text-[#9397bc] dark:text-zinc-500">
                    {selected.size} of {suggestions.length} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={fetchSuggestions} disabled={loading}>
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Regenerate
                  </GhostButton>
                  <Button
                    onClick={() => {
                      const indices = selected.size > 0
                        ? Array.from(selected)
                        : suggestions.map((_, i) => i);
                      handleAdd(indices);
                    }}
                    disabled={loading}
                  >
                    <Plus size={14} />
                    {selected.size > 0 ? `Add ${selected.size} Selected` : "Add All"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
