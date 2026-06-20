"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TrendPoint {
  label: string;
  intensity: number;
}

interface DataTrendChartProps {
  data: TrendPoint[];
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#141414] px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-0.5 font-medium text-white">{payload[0].value}% intensity</p>
    </div>
  );
}

export function DataTrendChart({ data }: DataTrendChartProps) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#5eead4" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#52525b", fontSize: 11 }}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            fill="url(#intensityGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#a78bfa", stroke: "#0a0a0a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
