import { motion } from "framer-motion";

export function Header({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6"
    >
      {kicker && (
        <span
          className="inline-flex items-center rounded-xl px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgb(91 92 226 / 0.10)",
            color: "#5b5ce2",
          }}
        >
          {kicker}
        </span>
      )}
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a1b2e] md:text-4xl dark:text-zinc-50">
        {title}
      </h1>
    </motion.header>
  );
}
