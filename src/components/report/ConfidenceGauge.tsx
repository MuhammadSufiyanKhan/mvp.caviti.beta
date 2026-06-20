"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConfidenceGaugeProps {
  score: number;
}

export function ConfidenceGauge({ score }: ConfidenceGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const data = [
    { name: "score", value: clamped },
    { name: "remainder", value: 100 - clamped },
  ];

  return (
    <div className="relative h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.95} />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={72}
            outerRadius={96}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="url(#confidenceGradient)" />
            <Cell fill="#1f2937" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-3xl font-medium tracking-tight text-foreground">{clamped}%</span>
        <span className="mt-1 text-xs text-muted">Confidence</span>
      </div>
    </div>
  );
}
