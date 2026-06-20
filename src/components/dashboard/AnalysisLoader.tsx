"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Fetching Data", "AI Thinking", "Generating Report"] as const;

interface AnalysisLoaderProps {
  activeStep: number;
}

export function AnalysisLoader({ activeStep }: AnalysisLoaderProps) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-surface/50 p-6">
      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  done && "border-violet-500/30 bg-violet-500/10 text-violet-300",
                  current && "border-violet-500/40 bg-violet-500/5",
                  !done && !current && "border-border"
                )}
              >
                {done ? (
                  <Check className="h-3 w-3" strokeWidth={2} />
                ) : current ? (
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-violet-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-border" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  done && "text-muted",
                  current && "font-medium text-foreground",
                  !done && !current && "text-muted/60"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
