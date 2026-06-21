"use client";

import { ReportProvider } from "@/context/ReportContext";
import { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <ReportProvider>{children}</ReportProvider>;
}
