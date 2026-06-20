"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConfidenceGauge } from "@/components/report/ConfidenceGauge";
import type { ReportMarketData } from "@/types/analysis";

interface DashboardChartsProps {
  data: ReportMarketData;
  reportTitle: string;
}

function BarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { label: string } }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="text-muted">{payload[0].payload.label}</p>
      <p className="font-medium text-foreground">{payload[0].value}</p>
    </div>
  );
}

export function DashboardCharts({ data, reportTitle }: DashboardChartsProps) {
  const signalData = [
    { label: "Signal", value: data.market_signal_strength },
    { label: "Data", value: Math.min(100, Math.round(data.data_points / 50)) },
    { label: "Gaps", value: Math.min(100, data.gaps_found * 8) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle>AI confidence</CardTitle>
          <CardDescription>{reportTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfidenceGauge score={data.confidence_score} />
        </CardContent>
      </Card>

      <Card className="bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle>Market signal</CardTitle>
          <CardDescription>
            Strength {data.market_signal_strength}% · {data.data_points} data points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signalData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="violetBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.35} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {signalData.map((_, i) => (
                    <Cell key={i} fill="url(#violetBar)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
