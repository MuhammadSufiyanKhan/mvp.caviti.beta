"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "Fetching Data", delay: 0 },
  { label: "AI Thinking", delay: 0.15 },
  { label: "Generating Report", delay: 0.3 },
];

export function ReportProcessing({ productName }: { productName?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-10 h-16 w-16">
        <motion.div
          className="absolute inset-0 rounded-full border border-white/[0.06]"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-t-violet-400/80 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-teal-400/80" />
        </div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium text-white"
      >
        {productName ? `Analyzing ${productName}` : "Processing your report"}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-sm text-zinc-500"
      >
        This usually takes a few seconds
      </motion.p>

      <div className="mt-12 w-full max-w-sm space-y-3 text-left">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
            />
            <span className="text-sm text-zinc-400">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
