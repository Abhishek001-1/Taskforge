import type { HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ComponentProps } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

/* ── Card ───────────────────────────────────────────────── */
export function Card({ className, children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        // Light mode: solid white, rich border, subtle inner shadow
        "rounded-3xl border border-[#d5d2f0] bg-white p-5 shadow-[0_4px_20px_rgb(91_92_226/0.10),0_1px_4px_rgb(0_0_0/0.05)] backdrop-blur-sm",
        // Light mode inner top shine
        "ring-1 ring-inset ring-white/60",
        // Dark mode: layered glass
        "dark:border-white/[0.08] dark:bg-[#111221] dark:shadow-[0_8px_32px_rgb(0_0_0/0.40),0_1px_0_rgb(255_255_255/0.05)_inset] dark:ring-white/[0.04]",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── GlassCard — slightly elevated variant ──────────────── */
export function GlassCard({ className, children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-3xl border border-[#d5d2f0]/60 bg-white/70 p-5 shadow-[0_8px_32px_rgb(91_92_226/0.12)] backdrop-blur-lg ring-1 ring-inset ring-white/80",
        "dark:border-white/[0.07] dark:bg-white/[0.04] dark:shadow-[0_8px_40px_rgb(0_0_0/0.45)] dark:ring-white/[0.03]",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Button ─────────────────────────────────────────────── */
export const Button = ({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.97]",
      // Light: vibrant gradient + glow
      "bg-gradient-to-br from-[#5b5ce2] to-[#4546c8] shadow-[0_4px_14px_rgb(91_92_226/0.45)] hover:from-[#6465ea] hover:to-[#5b5ce2] hover:shadow-[0_6px_20px_rgb(91_92_226/0.55)]",
      // Dark: lighter indigo
      "dark:from-[#7879f1] dark:to-[#5b5ce2] dark:shadow-[0_4px_14px_rgb(91_92_226/0.30)] dark:hover:from-[#8f90f5] dark:hover:to-[#7879f1]",
      className,
    )}
    {...p}
  />
);

/* ── GhostButton ─────────────────────────────────────────── */
export const GhostButton = ({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition-all active:scale-[0.97]",
      // Light
      "border-[#cdc9ee] bg-white text-[#5b5ce2] hover:border-[#5b5ce2] hover:bg-[#ede9ff] hover:shadow-[0_2px_8px_rgb(91_92_226/0.15)]",
      // Dark
      "dark:border-white/10 dark:bg-white/5 dark:text-[#a5b4fc] dark:hover:border-white/20 dark:hover:bg-white/10",
      className,
    )}
    {...p}
  />
);

/* ── Input ───────────────────────────────────────────────── */
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      "w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition-all",
      // Light: contrast-rich background & text
      "border-[#ccc9ed] bg-[#f4f3fc] text-[#1a1b2e] placeholder:text-[#9397bc]",
      "hover:border-[#b0acdf] focus:border-[#5b5ce2] focus:bg-white focus:shadow-[0_0_0_3px_rgb(91_92_226/0.15)]",
      // Dark
      "dark:border-white/10 dark:bg-[#1c1e30] dark:text-zinc-100 dark:placeholder:text-zinc-500",
      "dark:hover:border-white/20 dark:focus:border-[#8183f4] dark:focus:bg-[#22243a] dark:focus:shadow-[0_0_0_3px_rgb(129_131_244/0.20)]",
      className,
    )}
    {...p}
  />
);

/* ── Textarea ────────────────────────────────────────────── */
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "min-h-24 w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition-all resize-none",
      // Light
      "border-[#ccc9ed] bg-[#f4f3fc] text-[#1a1b2e] placeholder:text-[#9397bc]",
      "hover:border-[#b0acdf] focus:border-[#5b5ce2] focus:bg-white focus:shadow-[0_0_0_3px_rgb(91_92_226/0.15)]",
      // Dark
      "dark:border-white/10 dark:bg-[#1c1e30] dark:text-zinc-100 dark:placeholder:text-zinc-500",
      "dark:hover:border-white/20 dark:focus:border-[#8183f4] dark:focus:bg-[#22243a] dark:focus:shadow-[0_0_0_3px_rgb(129_131_244/0.20)]",
      className,
    )}
    {...p}
  />
);

/* ── Select ──────────────────────────────────────────────── */
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      "w-full rounded-2xl border px-3.5 py-2.5 text-sm outline-none transition-all appearance-none",
      // Light
      "border-[#ccc9ed] bg-[#f4f3fc] text-[#1a1b2e]",
      "hover:border-[#b0acdf] focus:border-[#5b5ce2] focus:bg-white focus:shadow-[0_0_0_3px_rgb(91_92_226/0.15)]",
      // Dark — force dark bg on the dropdown list itself via color-scheme
      "dark:border-white/10 dark:bg-[#1c1e30] dark:text-zinc-100 dark:[color-scheme:dark]",
      "dark:hover:border-white/20 dark:focus:border-[#8183f4] dark:focus:bg-[#22243a] dark:focus:shadow-[0_0_0_3px_rgb(129_131_244/0.20)]",
      className,
    )}
    {...p}
  >
    {children}
  </select>
);

/* ── Label ───────────────────────────────────────────────── */
export const Label = ({ className, ...p }: HTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      "mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#7175a0] dark:text-zinc-500",
      className,
    )}
    {...p}
  />
);

/* ── Progress bar ────────────────────────────────────────── */
export const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("h-2 overflow-hidden rounded-full bg-[#e8e5f8] dark:bg-white/10", className)}>
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-[#5b5ce2] via-[#7879f1] to-[#3d8bfd]"
      style={{ boxShadow: "0 0 8px rgb(91 92 226 / 0.5)" }}
      initial={false}
      animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

/* ── Stat card ───────────────────────────────────────────── */
const statConfig = [
  {
    gradient: "from-[#ede9fe] to-[#f5f3ff]",
    dark: "dark:from-[#5b5ce2]/15 dark:to-[#5b5ce2]/5",
    icon: "bg-[#5b5ce2] text-white shadow-[0_4px_12px_rgb(91_92_226/0.45)]",
    text: "text-[#5b5ce2] dark:text-indigo-300",
  },
  {
    gradient: "from-[#dbeafe] to-[#eff6ff]",
    dark: "dark:from-[#3d8bfd]/15 dark:to-[#3d8bfd]/5",
    icon: "bg-[#3d8bfd] text-white shadow-[0_4px_12px_rgb(61_139_253/0.45)]",
    text: "text-[#3d8bfd] dark:text-blue-300",
  },
  {
    gradient: "from-[#ffedd5] to-[#fff7ed]",
    dark: "dark:from-[#f97316]/15 dark:to-[#f97316]/5",
    icon: "bg-[#f97316] text-white shadow-[0_4px_12px_rgb(249_115_22/0.45)]",
    text: "text-[#f97316] dark:text-orange-300",
  },
  {
    gradient: "from-[#d1fae5] to-[#ecfdf5]",
    dark: "dark:from-[#10b981]/15 dark:to-[#10b981]/5",
    icon: "bg-[#10b981] text-white shadow-[0_4px_12px_rgb(16_185_129/0.45)]",
    text: "text-[#10b981] dark:text-emerald-300",
  },
  {
    gradient: "from-[#fce7f3] to-[#fdf2f8]",
    dark: "dark:from-[#ec4899]/15 dark:to-[#ec4899]/5",
    icon: "bg-[#ec4899] text-white shadow-[0_4px_12px_rgb(236_72_153/0.45)]",
    text: "text-[#ec4899] dark:text-pink-300",
  },
];

export const Stat = ({
  label,
  value,
  icon,
  tone = 0,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tone?: number;
}) => {
  const cfg = statConfig[tone % statConfig.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-3xl border border-[#d5d2f0] p-5 shadow-[0_4px_20px_rgb(91_92_226/0.09)] ring-1 ring-inset ring-white/60",
        "bg-gradient-to-br",
        cfg.gradient,
        cfg.dark,
        "dark:border-white/[0.08] dark:ring-white/[0.04]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-wider", cfg.text)}>{label}</p>
          <p className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#1a1b2e] dark:text-zinc-50">{value}</p>
        </div>
        {icon && (
          <div className={cn("rounded-2xl p-2.5", cfg.icon)}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ── Section heading ─────────────────────────────────────── */
export const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-xl font-bold text-[#1a1b2e] dark:text-zinc-50", className)}>{children}</h2>
);

/* ── Divider ─────────────────────────────────────────────── */
export const Divider = ({ className }: { className?: string }) => (
  <hr className={cn("border-[#d8d5f4] dark:border-white/10", className)} />
);

/* ── Badge ───────────────────────────────────────────────── */
export const Badge = ({
  children,
  tone = 0,
  className,
}: {
  children: React.ReactNode;
  tone?: number;
  className?: string;
}) => {
  const colors = [
    "bg-[#ede9fe] text-[#5b5ce2] dark:bg-[#5b5ce2]/20 dark:text-indigo-300",
    "bg-[#dbeafe] text-[#3d8bfd] dark:bg-[#3d8bfd]/20 dark:text-blue-300",
    "bg-[#ffedd5] text-[#f97316] dark:bg-[#f97316]/20 dark:text-orange-300",
    "bg-[#d1fae5] text-[#10b981] dark:bg-[#10b981]/20 dark:text-emerald-300",
    "bg-[#fce7f3] text-[#ec4899] dark:bg-[#ec4899]/20 dark:text-pink-300",
  ];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colors[tone % colors.length],
        className,
      )}
    >
      {children}
    </span>
  );
};
