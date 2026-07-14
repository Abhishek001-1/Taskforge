import { Download, Upload, RotateCcw, FileText } from "lucide-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "../components/Header";
import { Button, Card, GhostButton, Input, Label, Select } from "../components/ui";
import { useTracker } from "../contexts/TrackerContext";
import type { TrackerState } from "../types";

const schema = z.object({ appName: z.string().min(2), dsaTarget: z.coerce.number().min(1).max(20), theme: z.enum(["light", "dark", "system"]), reminder: z.boolean() });
export default function Settings() {
  const { state, updateSettings, replace, reset } = useTracker();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: state.settings });
  const exportJson = () => download(JSON.stringify(state, null, 2), "taskforge-export.json", "application/json");
  const exportPdf = () => download(`TaskForge Progress\n\n${JSON.stringify(state, null, 2)}`, "taskforge-progress.txt", "text/plain");
  const importJson = (file?: File) => file?.text().then((x) => replace(JSON.parse(x) as TrackerState));
  return <><Header title="Settings" kicker="Personalize, backup, and reset" /><div className="grid gap-5 xl:grid-cols-2"><Card><form onSubmit={form.handleSubmit(updateSettings)} className="space-y-4"><Field label="App name"><Input {...form.register("appName")} /></Field><Field label="Daily DSA target"><Input type="number" {...form.register("dsaTarget")} /></Field><Field label="Theme"><Select {...form.register("theme")}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></Select></Field><label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-200"><input type="checkbox" {...form.register("reminder")} /> Daily reminder popup</label><Button>Save settings</Button></form></Card><Card><div className="grid gap-3 sm:grid-cols-2"><GhostButton onClick={exportJson}><Download size={17} /> Export JSON</GhostButton><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"><Upload size={17} /> Import JSON<input hidden type="file" accept="application/json" onChange={(e) => importJson(e.target.files?.[0])} /></label><GhostButton onClick={exportPdf}><FileText size={17} /> Export progress</GhostButton><GhostButton className="text-red-600" onClick={reset}><RotateCcw size={17} /> Reset all data</GhostButton></div></Card></div></>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><Label>{label}</Label>{children}</div>; }
function download(body: string, name: string, type: string) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
