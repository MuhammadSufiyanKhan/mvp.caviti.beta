"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Activity, BarChart3, Target, CheckCircle2, Trash2, ExternalLink, Search, ChevronRight } from "lucide-react";
import { AnalysisLoader } from "@/components/dashboard/AnalysisLoader";
import type { Database } from "@/types/database.types";

type Report = Database["public"]["Tables"]["reports"]["Row"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [remainingTrials, setRemainingTrials] = useState(0);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [reportsResult, profileResult] = await Promise.all([
      supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("remaining_trials").eq("id", user.id).single(),
    ]);
    if (reportsResult.data) setReports(reportsResult.data);
    if (profileResult.data) setRemainingTrials(profileResult.data.remaining_trials ?? 0);
  }, [supabase]);

  const handleAnalyze = async () => {
    if (!url.trim()) { alert("Please enter a URL or product name."); return; }
    setLoading(true);
    setLoadingStep(0);
    stepTimerRef.current = setInterval(() => setLoadingStep((s) => Math.min(2, s + 1)), 2800);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const res = await fetch("/api/analyze-serpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoadingStep(2);
        await fetchDashboardData();
        router.push(`/dashboard/report/${data.id}`);
      } else {
        alert("Error: " + (data.error || "Analysis failed"));
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Delete this report?")) return;
    setDeletingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) { alert("Error: " + (body.error || "Failed")); return; }
      setReports(prev => prev.filter(r => r.id !== reportId));
      setRemainingTrials(prev => prev + 1);
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete ALL reports?")) return;
    setDeletingId("all");
    try {
      const res = await fetch("/api/reports", { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) { alert("Error: " + (body.error || "Failed")); return; }
      setReports([]);
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  useEffect(() => {
    const run = async () => {
      await fetchDashboardData();
    };
    run();
  }, [fetchDashboardData]);


  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#E5E7EB", fontFamily: "var(--font-geist-sans)" }}>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(31,41,55,1)", background: "rgba(10,10,10,0.78)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Caviti Logo"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-white font-bold text-xl">caviti</span>
            </div>
            <span style={{ color: "rgba(229,231,235,0.12)" }}>/</span>
            <span style={{ fontSize: "13px", color: "#A1A1AA", background: "rgba(17,17,17,0.6)", border: "1px solid rgba(31,41,55,1)", padding: "4px 12px", borderRadius: "8px" }}>Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "14px" }}>
            <Link href="/dashboard" style={{ color: "#E5E7EB", textDecoration: "none", fontWeight: 600 }}>Overview</Link>
            <Link href="/dashboard/billing" style={{ color: "#A1A1AA", textDecoration: "none" }}>Billing</Link>
            <Link href="/" style={{ color: "#A1A1AA", textDecoration: "none" }}>Home</Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 10 }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { title: "Trials Remaining", value: String(remainingTrials), icon: Activity, color: "#3b82f6", glow: "rgba(59,130,246,0.15)" },
            { title: "Total Reports", value: String(reports.length), icon: BarChart3, color: "#8b5cf6", glow: "rgba(139,92,246,0.15)" },
            { title: "Gaps Identified", value: reports.length > 0 ? `${reports.length * 5}+` : "—", icon: Target, color: "#10b981", glow: "rgba(16,185,129,0.15)" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -3, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "24px", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "18px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: stat.glow, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${stat.color}25` }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#475569", marginBottom: "6px", fontWeight: 500 }}>{stat.title}</p>
                <p style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "36px", marginBottom: "28px", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Analyze Competitor or Product</h2>
            <p style={{ fontSize: "14px", color: "#475569" }}>Enter a product name or competitor URL to get real market insights</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input
                type="text"
                placeholder="https://competitor.com or product name..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleAnalyze()}
                disabled={loading}
                style={{ width: "100%", paddingLeft: "44px", paddingRight: "16px", paddingTop: "15px", paddingBottom: "15px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(59,130,246,0.4)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || remainingTrials === 0}
              style={{ background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", padding: "15px 32px", borderRadius: "14px", fontSize: "14px", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", boxShadow: "0 0 30px rgba(59,130,246,0.25)" }}>
              {loading ? "Analyzing..." : <><span>Run Analysis</span><ChevronRight size={16} /></>}
            </button>
          </div>
          {loading && <AnalysisLoader activeStep={loadingStep} />}
          {remainingTrials === 0 && !loading && (
            <p style={{ marginTop: "16px", fontSize: "13px", color: "#ef4444" }}>
              No trials remaining. <Link href="/dashboard/billing" style={{ color: "#3b82f6", textDecoration: "none" }}>Upgrade →</Link>
            </p>
          )}
        </motion.div>

        {/* Reports Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", overflow: "hidden", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Recent Reports</h2>
              <p style={{ fontSize: "13px", color: "#475569" }}>{reports.length} total analyses</p>
            </div>
            {reports.length > 0 && (
              <button onClick={handleDeleteAll} disabled={deletingId === "all"}
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", padding: "8px 16px", borderRadius: "10px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Trash2 size={14} />
                {deletingId === "all" ? "Deleting..." : "Delete All"}
              </button>
            )}
          </div>

          {reports.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center" }}>
              <BarChart3 size={44} style={{ margin: "0 auto 16px", opacity: 0.1 }} />
              <p style={{ fontSize: "15px", color: "#334155" }}>No reports yet. Analyze your first product above.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Project", "Status", "Date", "Action"].map((h, i) => (
                    <th key={i} style={{ padding: "14px 28px", textAlign: i === 3 ? "right" : "left", fontSize: "11px", color: "#334155", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => {
                  const data = report.market_data as any;
                  return (
                    <motion.tr key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "18px 28px" }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", textTransform: "capitalize" }}>{report.product_name}</p>
                        {data?.url && (
                          <p style={{ fontSize: "12px", color: "#334155", display: "flex", alignItems: "center", gap: "4px" }}>
                            <ExternalLink size={11} />
                            {data.url.replace(/^https?:\/\//, "").slice(0, 40)}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "18px 28px" }}>
                        <span style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", padding: "5px 12px", borderRadius: "100px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <CheckCircle2 size={11} /> Complete
                        </span>
                      </td>
                      <td style={{ padding: "18px 28px", fontSize: "13px", color: "#334155" }}>
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "18px 28px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                          <Link href={`/dashboard/report/${report.id}`} style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", color: "#60a5fa", padding: "7px 16px", borderRadius: "10px", fontSize: "13px", textDecoration: "none", fontWeight: 500 }}>View →</Link>
                          <button onClick={() => handleDelete(report.id)} disabled={deletingId === report.id}
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", padding: "7px 10px", borderRadius: "10px", cursor: "pointer" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>
    </div>
  );
}