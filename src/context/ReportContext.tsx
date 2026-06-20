"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";

type Report = Database["public"]["Tables"]["reports"]["Row"];

interface ReportContextType {
  activeReport: Report | null;
  setActiveReport: (report: Report | null) => void;
  saveReport: (report: Omit<Report, "id" | "created_at" | "user_id">) => Promise<Report | null>;
  loadReport: (id: string) => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const supabase = createClient();

  const saveReport = async (report: Omit<Report, "id" | "created_at" | "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("reports")
      .insert([{ ...report, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error saving report:", error);
      return null;
    }
    setActiveReport(data);
    return data;
  };

  const loadReport = async (id: string) => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading report:", error);
      return;
    }
    setActiveReport(data);
  };

  return (
    <ReportContext.Provider value={{ activeReport, setActiveReport, saveReport, loadReport }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
}
