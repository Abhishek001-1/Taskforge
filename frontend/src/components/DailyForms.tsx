import { aiTopics, blankDraft, difficulties, draftToPatch, platforms, type DayFormDraft } from "../data/defaults";
import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayEntry, DayPatch } from "../types";
import { dayScore } from "../utils/stats";
import { Button, Card, Input, Label, Progress, Select, Textarea } from "./ui";

type Props = {
  day: DayEntry;
  onChange: (patch: DayPatch) => void;
};

/* Animated card container with staggered children */
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
  }),
};

/* Section icon mapping */
const sectionMeta = {
  dsa:     { color: "from-[#5b5ce2] to-[#4546c8]", light: "bg-[#ede9fe] text-[#5b5ce2]" },
  system:  { color: "from-[#3d8bfd] to-[#2563eb]", light: "bg-[#dbeafe] text-[#3d8bfd]" },
  ai:      { color: "from-[#a78bfa] to-[#7c3aed]", light: "bg-[#ede9fe] text-[#7c3aed]" },
  hr:      { color: "from-[#f97316] to-[#ea580c]", light: "bg-[#ffedd5] text-[#f97316]" },
  misc:    { color: "from-[#10b981] to-[#059669]", light: "bg-[#d1fae5] text-[#10b981]" },
  notes:   { color: "from-[#ec4899] to-[#db2777]", light: "bg-[#fce7f3] text-[#ec4899]" },
};

function SectionBadge({ label, metaKey }: { label: string; metaKey: keyof typeof sectionMeta }) {
  const m = sectionMeta[metaKey];
  return (
    <span className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${m.light} dark:bg-white/10 dark:text-zinc-300`}>
      {label}
    </span>
  );
}

function StyledCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="mt-2 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#3d3f5c] dark:text-zinc-300 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="shrink-0"
      />
      {label}
    </label>
  );
}

export function DailyForms({ day, onChange }: Props) {
  const [draft, setDraft] = useState<DayFormDraft>(blankDraft);
  const [status, setStatus] = useState("");
  const saved = dayScore(day);

  useEffect(() => {
    setDraft(blankDraft());
    setStatus("");
  }, [day.date]);

  const patchDraft = (patch: Partial<DayFormDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const patch = draftToPatch(draft, day.dsa.target);
    if (!patch) {
      setStatus("Add at least one field, then save.");
      return;
    }
    onChange(patch);
    setDraft(blankDraft());
    setStatus("Saved — form cleared. Edit again anytime to update.");
  };

  return (
    <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
      {/* ── Header card ─────────────────────────────── */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={[
          "xl:col-span-2 rounded-3xl p-5",
          "border border-[#d5d2f0] shadow-[0_4px_20px_rgb(91_92_226/0.10)]",
          "bg-gradient-to-br from-white via-[#f4f3fc] to-[#ebe9fc]",
          "ring-1 ring-inset ring-white/60",
          "dark:border-white/[0.08] dark:from-[#111221] dark:via-[#141530] dark:to-[#111221]",
          "dark:shadow-[0_8px_32px_rgb(0_0_0/0.40)]",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#1a1b2e] dark:text-zinc-50">Log today</h2>
            <p className="mt-1 text-sm text-[#7175a0] dark:text-zinc-400">
              {day.date} · Save merges into today's record.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#1a1b2e] dark:text-zinc-200">{saved}/5 tracked</div>
            <Progress value={saved * 20} className="mt-2 w-36" />
          </div>
        </div>
      </motion.div>

      {/* ── DSA ──────────────────────────────────────── */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="xl:col-span-2">
        <Card className="border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #5b5ce2, #4546c8)", boxShadow: "0 3px 10px rgb(91 92 226/0.45)" }}
            >
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">DSA Practice</h2>
              <p className="text-xs text-[#9397bc] dark:text-zinc-500">Leave blank to keep whatever was saved earlier.</p>
            </div>
            <SectionBadge label="DSA" metaKey="dsa" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Solved">
              <Input
                type="number"
                min={0}
                max={day.dsa.target}
                value={draft.dsa.solved}
                placeholder="0"
                onChange={(e) => patchDraft({ dsa: { ...draft.dsa, solved: e.target.value } })}
              />
            </Field>
            <Field label="Difficulty">
              <Select
                value={draft.dsa.difficulty}
                onChange={(e) => patchDraft({ dsa: { ...draft.dsa, difficulty: e.target.value } })}
              >
                <option value="">Select</option>
                {difficulties.map((x) => <option key={x} value={x}>{x}</option>)}
              </Select>
            </Field>
            <Field label="Platform">
              <Select
                value={draft.dsa.platform}
                onChange={(e) => patchDraft({ dsa: { ...draft.dsa, platform: e.target.value } })}
              >
                <option value="">Select</option>
                {platforms.map((x) => <option key={x} value={x}>{x}</option>)}
              </Select>
            </Field>
            <Field label="Notes">
              <Input
                value={draft.dsa.notes}
                onChange={(e) => patchDraft({ dsa: { ...draft.dsa, notes: e.target.value } })}
                placeholder="Patterns, misses, wins"
              />
            </Field>
          </div>
        </Card>
      </motion.div>

      {/* ── System Design ───────────────────────────── */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="h-full border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #3d8bfd, #2563eb)", boxShadow: "0 3px 10px rgb(61 139 253/0.45)" }}
            >
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">System Design</h2>
            </div>
            <SectionBadge label="Reading" metaKey="system" />
          </div>
          <Field label="Article name">
            <Input
              value={draft.system.title}
              onChange={(e) => patchDraft({ system: { ...draft.system, title: e.target.value } })}
              placeholder="Article / topic"
            />
          </Field>
          <Field label="URL">
            <Input
              value={draft.system.url}
              onChange={(e) => patchDraft({ system: { ...draft.system, url: e.target.value } })}
              placeholder="https://"
            />
          </Field>
          <StyledCheckbox
            label="Mark as read"
            checked={draft.system.read}
            onChange={(v) => patchDraft({ system: { ...draft.system, read: v } })}
          />
          <Field label="Notes" className="mt-3">
            <Textarea
              value={draft.system.notes}
              onChange={(e) => patchDraft({ system: { ...draft.system, notes: e.target.value } })}
              placeholder="Key takeaways"
            />
          </Field>
        </Card>
      </motion.div>

      {/* ── AI Learning ─────────────────────────────── */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="h-full border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 3px 10px rgb(167 139 250/0.45)" }}
            >
              3
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">AI Learning</h2>
            </div>
            <SectionBadge label="AI" metaKey="ai" />
          </div>
          <Field label="Topic">
            <Select
              value={draft.ai.topic}
              onChange={(e) => patchDraft({ ai: { ...draft.ai, topic: e.target.value } })}
            >
              <option value="">Select</option>
              {aiTopics.map((x) => <option key={x} value={x}>{x}</option>)}
            </Select>
          </Field>
          <Field label="Article title">
            <Input
              value={draft.ai.title}
              onChange={(e) => patchDraft({ ai: { ...draft.ai, title: e.target.value } })}
              placeholder="Title"
            />
          </Field>
          <Field label="URL">
            <Input
              value={draft.ai.url}
              onChange={(e) => patchDraft({ ai: { ...draft.ai, url: e.target.value } })}
              placeholder="https://"
            />
          </Field>
          <StyledCheckbox
            label="Completed"
            checked={draft.ai.completed}
            onChange={(v) => patchDraft({ ai: { ...draft.ai, completed: v } })}
          />
          <Field label="Notes" className="mt-3">
            <Textarea
              value={draft.ai.notes}
              onChange={(e) => patchDraft({ ai: { ...draft.ai, notes: e.target.value } })}
              placeholder="Notes"
            />
          </Field>
        </Card>
      </motion.div>

      {/* ── Behavioral ──────────────────────────────── */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="h-full border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 3px 10px rgb(249 115 22/0.45)" }}
            >
              4
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">Behavioral</h2>
            </div>
            <SectionBadge label="HR Prep" metaKey="hr" />
          </div>
          <Field label="Question">
            <Input
              value={draft.hr.question}
              onChange={(e) => patchDraft({ hr: { ...draft.hr, question: e.target.value } })}
              placeholder="Tell me about a time…"
            />
          </Field>
          <Field label="Confidence">
            <Select
              value={draft.hr.confidence}
              onChange={(e) => patchDraft({ hr: { ...draft.hr, confidence: e.target.value } })}
            >
              <option value="">Select</option>
              {["Low", "Medium", "High"].map((x) => <option key={x} value={x}>{x}</option>)}
            </Select>
          </Field>
          <StyledCheckbox
            label="Answer practiced"
            checked={draft.hr.practiced}
            onChange={(v) => patchDraft({ hr: { ...draft.hr, practiced: v } })}
          />
        </Card>
      </motion.div>

      {/* ── Miscellaneous ───────────────────────────── */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="h-full border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 3px 10px rgb(16 185 129/0.45)" }}
            >
              5
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">Miscellaneous</h2>
            </div>
            <SectionBadge label="Other" metaKey="misc" />
          </div>
          <StyledCheckbox
            label="Completed"
            checked={draft.misc.completed}
            onChange={(v) => patchDraft({ misc: { ...draft.misc, completed: v } })}
          />
          <Field label="Notes" className="mt-3">
            <Textarea
              value={draft.misc.notes}
              onChange={(e) => patchDraft({ misc: { ...draft.misc, notes: e.target.value } })}
              placeholder="Anything outside the main tracks"
            />
          </Field>
        </Card>
      </motion.div>

      {/* ── Daily Notes + Save ─────────────────────── */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants} className="xl:col-span-2">
        <Card className="border-[#d5d2f0] dark:border-white/[0.08]">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold"
              style={{ background: "linear-gradient(135deg, #ec4899, #db2777)", boxShadow: "0 3px 10px rgb(236 72 153/0.45)" }}
            >
              ✎
            </div>
            <h2 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">Daily Notes</h2>
          </div>
          <Textarea
            value={draft.notes}
            onChange={(e) => patchDraft({ notes: e.target.value })}
            placeholder="Reflection, blockers, topics to revisit"
            className="min-h-28"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <AnimatePresence>
              {status ? (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-[#10b981] dark:text-emerald-400"
                >
                  ✓ {status}
                </motion.p>
              ) : (
                <span />
              )}
            </AnimatePresence>
            <Button type="submit">Save today</Button>
          </div>
        </Card>
      </motion.div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
