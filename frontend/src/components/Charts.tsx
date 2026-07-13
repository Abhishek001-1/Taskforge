import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const axis = { tickLine: false, axisLine: false, fontSize: 12 };
export function CompletionArea({ data }: { data: object[] }) {
  return <ResponsiveContainer width="100%" height={280}><AreaChart data={data}><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#22c55e" stopOpacity=".55" /><stop offset="1" stopColor="#38bdf8" stopOpacity=".05" /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={.25} /><XAxis dataKey="date" {...axis} /><YAxis {...axis} /><Tooltip /><Area type="monotone" dataKey="completion" stroke="#10b981" fill="url(#g)" strokeWidth={3} /></AreaChart></ResponsiveContainer>;
}
export function DsaLine({ data }: { data: object[] }) {
  return <ResponsiveContainer width="100%" height={260}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={.25} /><XAxis dataKey="date" {...axis} /><YAxis {...axis} /><Tooltip /><Line type="monotone" dataKey="dsa" stroke="#8b5cf6" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer>;
}
export function PeriodBars({ data }: { data: object[] }) {
  return <ResponsiveContainer width="100%" height={240}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={.25} /><XAxis dataKey="date" {...axis} /><YAxis {...axis} /><Tooltip /><Bar dataKey="completion" radius={[10, 10, 0, 0]} fill="#38bdf8" /></BarChart></ResponsiveContainer>;
}
