import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Lightbulb,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Card, GhostButton, Badge } from "./ui";
import type { ResumeData, ResumeAnalysis } from "../services/aiApi";
import { uploadResume, getResume, deleteResume } from "../services/aiApi";

/* ── Shimmer placeholder ─────────────────────────────────── */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#e8e5f8] via-[#f4f3fc] to-[#e8e5f8] dark:from-white/5 dark:via-white/10 dark:to-white/5 ${className}`}
    />
  );
}

/* ── Badge list renderer ─────────────────────────────────── */
function TagList({ items, tone = 0 }: { items: string[]; tone?: number }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} tone={tone} className="text-[11px]">
          {item}
        </Badge>
      ))}
    </div>
  );
}

/* ── Analysis section ────────────────────────────────────── */
function AnalysisSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[#5b5ce2] dark:text-indigo-400">{icon}</span>
        <h4 className="text-sm font-bold text-[#1a1b2e] dark:text-zinc-100">{title}</h4>
      </div>
      {children}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export function ResumeCard() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResume();
      setResume(data);
    } catch {
      /* no resume yet */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const data = await uploadResume(file);
      setResume(data);
      setExpanded(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume();
      setResume(null);
      setExpanded(false);
    } catch {
      setError("Failed to delete resume");
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  if (loading) {
    return (
      <Card className="border-[#d5d2f0] dark:border-white/[0.08]">
        <Shimmer className="h-6 w-48 mb-3" />
        <Shimmer className="h-4 w-72" />
      </Card>
    );
  }

  const a: ResumeAnalysis = resume?.analysis || {};

  return (
    <Card className="border-[#d5d2f0] dark:border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              boxShadow: "0 4px 14px rgb(167 139 250 / 0.45)",
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#1a1b2e] dark:text-zinc-50">
              Resume Profile
            </h3>
            <p className="text-xs text-[#9397bc] dark:text-zinc-500">
              {resume ? resume.filename : "Upload your resume for AI-powered insights"}
            </p>
          </div>
        </div>

        {resume && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#7175a0] transition-colors hover:bg-[#ede9ff] hover:text-[#5b5ce2] dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-300"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm font-medium text-red-500"
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* No resume — upload zone */}
      {!resume && !uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all ${
              dragOver
                ? "border-[#5b5ce2] bg-[#ede9ff] dark:border-indigo-500 dark:bg-indigo-500/10"
                : "border-[#cdc9ee] bg-[#f9f8ff] hover:border-[#5b5ce2] hover:bg-[#ede9ff] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-indigo-500 dark:hover:bg-white/5"
            }`}
          >
            <div className="rounded-2xl bg-[#ede9fe] p-3 text-[#5b5ce2] dark:bg-indigo-500/20 dark:text-indigo-300">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1a1b2e] dark:text-zinc-200">
                Drop your resume PDF here
              </p>
              <p className="mt-1 text-xs text-[#9397bc] dark:text-zinc-500">
                or click to browse · PDF only · max 5 MB
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={onFileSelect}
              className="hidden"
            />
          </label>
        </motion.div>
      )}

      {/* Uploading state */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-[#cdc9ee] bg-[#f9f8ff] p-8 dark:border-white/10 dark:bg-white/[0.02]"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#5b5ce2] border-t-transparent" />
          <p className="text-sm font-semibold text-[#5b5ce2] dark:text-indigo-300">
            Analyzing your resume with AI...
          </p>
          <p className="text-xs text-[#9397bc] dark:text-zinc-500">
            This may take 15-30 seconds
          </p>
        </motion.div>
      )}

      {/* Resume exists — compact view always shows key tags */}
      {resume && !uploading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          {/* Quick tags row */}
          <div className="flex flex-wrap gap-1.5">
            {(a.programming_languages || []).slice(0, 6).map((l) => (
              <Badge key={l} tone={0} className="text-[11px]">{l}</Badge>
            ))}
            {(a.frameworks || []).slice(0, 4).map((f) => (
              <Badge key={f} tone={1} className="text-[11px]">{f}</Badge>
            ))}
            {(a.tools || []).slice(0, 3).map((t) => (
              <Badge key={t} tone={3} className="text-[11px]">{t}</Badge>
            ))}
          </div>

          {/* Expanded analysis */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5 overflow-hidden"
              >
                {/* Career Summary */}
                {a.career_summary && (
                  <div className="rounded-2xl bg-gradient-to-br from-[#ede9fe] to-[#f5f3ff] p-4 dark:from-[#5b5ce2]/10 dark:to-[#5b5ce2]/5">
                    <p className="text-sm font-medium text-[#3d3f5c] dark:text-zinc-300 leading-relaxed">
                      {a.career_summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {a.skills && a.skills.length > 0 && (
                  <AnalysisSection icon={<Star size={16} />} title="Skills">
                    <TagList items={a.skills} tone={0} />
                  </AnalysisSection>
                )}

                {/* All languages / frameworks / tools */}
                {a.programming_languages && a.programming_languages.length > 0 && (
                  <AnalysisSection icon={<Lightbulb size={16} />} title="Languages & Frameworks">
                    <TagList items={[...a.programming_languages, ...(a.frameworks || [])]} tone={1} />
                  </AnalysisSection>
                )}

                {/* Experience */}
                {a.experience && a.experience.length > 0 && (
                  <AnalysisSection icon={<Briefcase size={16} />} title="Experience">
                    <div className="space-y-1.5">
                      {a.experience.map((exp, i) => (
                        <p key={i} className="text-sm text-[#3d3f5c] dark:text-zinc-300">
                          <span className="font-semibold">{exp.role}</span>
                          {exp.company && ` at ${exp.company}`}
                          {exp.duration && ` · ${exp.duration}`}
                        </p>
                      ))}
                    </div>
                  </AnalysisSection>
                )}

                {/* Education */}
                {a.education && a.education.length > 0 && (
                  <AnalysisSection icon={<GraduationCap size={16} />} title="Education">
                    <div className="space-y-1.5">
                      {a.education.map((ed, i) => (
                        <p key={i} className="text-sm text-[#3d3f5c] dark:text-zinc-300">
                          <span className="font-semibold">{ed.degree}</span>
                          {ed.institution && ` — ${ed.institution}`}
                          {ed.year && ` (${ed.year})`}
                        </p>
                      ))}
                    </div>
                  </AnalysisSection>
                )}

                {/* Strengths */}
                {a.strengths && a.strengths.length > 0 && (
                  <AnalysisSection icon={<Star size={16} />} title="Key Strengths">
                    <ul className="space-y-1 pl-1">
                      {a.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3d3f5c] dark:text-zinc-300">
                          <span className="mt-1 text-[#10b981]">●</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </AnalysisSection>
                )}

                {/* Weaknesses / Improvement Areas */}
                {a.weaknesses && a.weaknesses.length > 0 && (
                  <AnalysisSection icon={<AlertTriangle size={16} />} title="Areas to Improve">
                    <ul className="space-y-1 pl-1">
                      {a.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3d3f5c] dark:text-zinc-300">
                          <span className="mt-1 text-[#f97316]">●</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </AnalysisSection>
                )}

                {/* AI Suggestions */}
                {a.suggestions && a.suggestions.length > 0 && (
                  <AnalysisSection icon={<Lightbulb size={16} />} title="AI Suggestions">
                    <ul className="space-y-1 pl-1">
                      {a.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3d3f5c] dark:text-zinc-300">
                          <span className="mt-1 text-[#5b5ce2]">▸</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </AnalysisSection>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <label className="cursor-pointer">
                    <GhostButton
                      type="button"
                      onClick={() => document.getElementById("resume-replace-input")?.click()}
                    >
                      <RefreshCw size={14} />
                      Replace
                    </GhostButton>
                    <input
                      id="resume-replace-input"
                      type="file"
                      accept=".pdf"
                      onChange={onFileSelect}
                      className="hidden"
                    />
                  </label>
                  <GhostButton
                    onClick={handleDelete}
                    className="!text-red-500 !border-red-200 hover:!bg-red-50 dark:!text-red-400 dark:!border-red-500/30 dark:hover:!bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    Delete
                  </GhostButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </Card>
  );
}
