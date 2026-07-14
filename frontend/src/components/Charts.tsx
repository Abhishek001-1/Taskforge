import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const axisStyle = {
  tickLine: false,
  axisLine: false,
  fontSize: 11,
  tick: { fill: "#7175a0", fontWeight: 600 },
};

const gridStyle = { strokeDasharray: "4 4", stroke: "rgb(91 92 226 / 0.12)" };

/* ── Shared tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff, #f4f3fc)",
        border: "1px solid #d5d2f0",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgb(91 92 226 / 0.18)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "#7175a0", fontWeight: 700, marginBottom: 4, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: "#1a1b2e", fontWeight: 800 }}>
          <span style={{ color: p.color }}>{p.name}</span>: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Completion area chart ─────────────────────────────── */
export function CompletionArea({ data }: { data: object[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradCompletion" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#5b5ce2" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3d8bfd" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="completion"
          name="Completion %"
          stroke="url(#lineGradCompletion)"
          fill="url(#gradCompletion)"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5, fill: "#5b5ce2", stroke: "#fff", strokeWidth: 2 }}
        />
        <defs>
          <linearGradient id="lineGradCompletion" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#5b5ce2" />
            <stop offset="100%" stopColor="#3d8bfd" />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── DSA line chart ────────────────────────────────────── */
export function DsaLine({ data }: { data: object[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGradDsa" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#5b5ce2" />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="dsa"
          name="DSA solved"
          stroke="url(#lineGradDsa)"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5, fill: "#a78bfa", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Period bars ───────────────────────────────────────── */
export function PeriodBars({ data }: { data: object[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#5b5ce2" />
            <stop offset="100%" stopColor="#3d8bfd" />
          </linearGradient>
        </defs>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip content={<ChartTooltip />} />
        <Bar
          dataKey="completion"
          name="Completion %"
          radius={[10, 10, 3, 3]}
          fill="url(#barGrad)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
