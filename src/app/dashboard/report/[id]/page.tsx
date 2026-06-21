"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import type { StaticImport } from "next/dist/shared/lib/get-img-props";

// NOTE: StaticImport is currently unused in this file but left as-is to avoid unrelated refactors.



import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { parseSection } from "@/lib/report-metrics";
import UserMenu from "@/components/UserMenu";
import type { Database } from "@/types/database.types";

type Report = Database["public"]["Tables"]["reports"]["Row"];

type Pillar = "box1" | "box2" | "box3";

type PillarCardProps = {
  pillar: Pillar;
  theme: {
    color: string;
    glow: string;
    border: string;
    accent: string;
  };
  icon: any;
  title: string;
  subtitle: string;
  items: string[];
  shouldBlurGlobal: boolean;
  subscriptionStatus: string;
};

function PillarCard({
  pillar,
  theme,
  icon: Icon,
  title,
  subtitle,
  items,
  shouldBlurGlobal,
}: PillarCardProps) {
  const shouldBlur = shouldBlurGlobal && (pillar === "box2" || pillar === "box3");

  return (
    <motion.div
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "22px",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          background: `linear-gradient(135deg, ${theme.glow}, transparent)`,
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "13px",
            background: theme.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${theme.border}`,
          }}
        >
          <Icon size={20} color={theme.color} />
        </div>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 800,
              marginBottom: "3px",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: "13px", color: "#475569" }}>{subtitle}</p>
        </div>
        <span
          style={{
            fontSize: "12px",
            color: theme.color,
            background: theme.accent,
            border: `1px solid ${theme.border}`,
            padding: "5px 14px",
            borderRadius: "100px",
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          {items.length} items
        </span>
      </div>

      <div
        style={{
          padding: "16px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          filter: shouldBlur ? "blur(6px)" : undefined,
          pointerEvents: shouldBlur ? "none" : undefined,
          opacity: shouldBlur ? 0.65 : 1,
        }}
      >
        {items.length > 0 ? (
          items.slice(0, 6).map((item, j) => (
            <motion.div
              key={j}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + j * 0.03 }}
              style={{
                display: "flex",
                gap: "14px",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "13px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: theme.color,
                  marginTop: "6px",
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${theme.color}`,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                  fontWeight: 650,
                }}
              >
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <p style={{ color: "#1e293b", fontSize: "14px", padding: "8px 0" }}>
            No data available.
          </p>
        )}
      </div>

      {shouldBlur ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,5,8,0.2) 0%, rgba(5,5,8,0.75) 70%)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 20,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: 16,
              border: `1px solid ${theme.border}`,
              background: "rgba(10,10,10,0.75)",
              padding: 16,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: theme.color,
                    marginBottom: 4,
                  }}
                >
                  Upgrade to Unlock
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  This pillar is available for Pro users.
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#0A0A0A",
                  background: theme.accent,
                  border: `1px solid ${theme.border}`,
                  padding: "6px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                Pro
              </span>
            </div>

            <a
              href="/dashboard/billing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.accent,
                color: theme.color,
                fontWeight: 950,
                textDecoration: "none",
              }}
            >
              Upgrade to Pro
            </a>

            <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8" }}>
              Tip: Box 1 is always visible on Free.
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const supabase = useMemo(() => createClient(), []);

  const [report, setReport] = useState<Report | null>(null);
  const [fetching, setFetching] = useState(true);

  const [isPro, setIsPro] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Loading...");

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };
    checkAuth();
  }, [supabase, router]);

  const fetchReport = useCallback(async () => {
    if (!id) return;

    setFetching(true);
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    setReport((data as Report | null) ?? null);
    setFetching(false);
  }, [id, supabase]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (!user) {
          setIsPro(false);
          setSubscriptionStatus("Free");
          setSubscriptionLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        const status = (profile as any)?.subscription_status;
        const pro = status === "pro";

        setIsPro(!!pro);
        setSubscriptionStatus(pro ? "Pro" : status ?? "Free");
        setSubscriptionLoading(false);
      } catch {
        if (!mounted) return;
        setIsPro(false);
        setSubscriptionStatus("Free");
        setSubscriptionLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const shouldBlurGlobal = !subscriptionLoading && !isPro;

  const [marketDataWithReviews, setMarketDataWithReviews] = useState<any>(null);
  const [complaintThemesLoading, setComplaintThemesLoading] = useState(true);

  const analysisText = (report?.market_data as any)?.analysis || "";
  const marketData = report?.market_data as any;

  // If report doesn't have real_reviews, fetch them automatically
  useEffect(() => {
    if (!report) return;

    const enrichData = async () => {
      setComplaintThemesLoading(true);
      let enrichedMarketData = { ...marketData };

      // If complaint_themes is missing, try to fetch them (for old reports)
      if (!enrichedMarketData?.complaint_themes || enrichedMarketData.complaint_themes.length === 0) {
        try {
          const res = await fetch("/api/fetch-real-reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName: report.product_name }),
          });

          if (res.ok) {
            const freshData = await res.json();
            // Store complaint themes for new format
            if (freshData?.complaint_themes) {
              enrichedMarketData.complaint_themes = freshData.complaint_themes;
              console.log("[Report] Fetched complaint themes for old report:", freshData.complaint_themes.length);
            }
            // Also store real_reviews for backward compatibility
            if (freshData?.real_reviews) {
              enrichedMarketData.real_reviews = freshData.real_reviews;
            }
          }
        } catch (err) {
          console.log("[Report] Could not fetch real reviews:", err);
        }
      }

      setMarketDataWithReviews(enrichedMarketData);
      setComplaintThemesLoading(false);
    };

    enrichData();
  }, [report, marketData]);

  const sections = useMemo(
    () => [
      {
        pillar: "box1" as const,
        title: "Product Vulnerabilities",
        subtitle: "Physical flaws, negative reviews, problems",
        icon: AlertCircle,
        theme: {
          color: "#ef4444",
          glow: "rgba(239,68,68,0.06)",
          border: "rgba(239,68,68,0.15)",
          accent: "rgba(239,68,68,0.1)",
        },
        items: parseSection(analysisText, "NEGATIVE POINTS"),
      },
      {
        pillar: "box2" as const,
        title: "Factory Instruction Manual",
        subtitle:
          "Exact technical specs to send to Alibaba supplier (copy-paste ready)",
        icon: TrendingUp,
        theme: {
          color: "#10b981",
          glow: "rgba(16,185,129,0.06)",
          border: "rgba(16,185,129,0.15)",
          accent: "rgba(16,185,129,0.1)",
        },
        items: parseSection(analysisText, "MARKET GAPS"),
      },
      {
        pillar: "box3" as const,
        title: "Ads & Creative Hooks",
        subtitle: "How to use these flaws in marketing + ad angles",
        icon: Rocket,
        theme: {
          color: "#22c55e",
          glow: "rgba(34,197,94,0.06)",
          border: "rgba(34,197,94,0.15)",
          accent: "rgba(34,197,94,0.1)",
        },
        items: parseSection(analysisText, "ENTRY STRATEGIES"),
      },
    ],
    [analysisText]
  );

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050508",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "3px solid rgba(59,130,246,0.15)",
            borderTop: "3px solid #3b82f6",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (fetching) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050508",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "3px solid rgba(59,130,246,0.15)",
            borderTop: "3px solid #3b82f6",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050508",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#475569",
        }}
      >
        Report not found.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050508",
        color: "white",
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/6 bg-black/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-slate-500 bg-white/4 border border-white/6 hover:bg-white/8 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-white/8 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Caviti Logo"
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-white font-bold text-lg sm:text-xl">caviti</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-400">
              {shouldBlurGlobal ? `Status: ${subscriptionStatus}` : "✓ Complete"}
            </span>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black -tracking-wider mb-4 capitalize">
            {report.product_name}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg text-slate-500 bg-white/3 border border-white/6">
              <Calendar size={12} />
              {new Date(report.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

            {marketData?.url ? (
              <a
                href={marketData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg text-blue-400 bg-blue-500/6 border border-blue-500/15 hover:bg-blue-500/10 transition-colors no-underline"
              >
                <ExternalLink size={12} />
                <span className="truncate">
                  {String(marketData.url)
                    .replace(/^https?:\/\//, "")
                    .slice(0, 50)}
                </span>
              </a>
            ) : null}
          </div>
        </motion.div>

        {/* Product Vulnerabilities - First Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {sections.length > 0 && (
            <PillarCard
              key={sections[0].pillar}
              pillar={sections[0].pillar}
              title={sections[0].title}
              subtitle={sections[0].subtitle}
              icon={sections[0].icon}
              theme={sections[0].theme}
              items={sections[0].items}
              shouldBlurGlobal={shouldBlurGlobal}
              subscriptionStatus={subscriptionStatus}
            />
          )}
        </div>

        {/* Complaint Themes Section - Verbatim Quotes from Real Reviews - Directly after Product Vulnerabilities and before Factory Instruction Manual */}
        {complaintThemesLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6 sm:mb-8 bg-white/2.5 border border-white/7 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-lg p-6 sm:p-8"
          >
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 size={40} className="animate-spin text-blue-400" />
              <p className="text-sm sm:text-base text-slate-400">Loading customer complaints...</p>
            </div>
          </motion.div>
        ) : (marketDataWithReviews || marketData)?.complaint_themes && (marketDataWithReviews || marketData).complaint_themes.length > 0 && (() => {
          const themes = (marketDataWithReviews || marketData).complaint_themes;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6 sm:mb-8 bg-white/2.5 border border-white/7 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-lg"
            >
              {/* Header */}
              <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-white/5 bg-gradient-to-r from-red-500/6 to-transparent flex items-center gap-4">
                <div className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                  <span className="text-lg sm:text-xl">⭐</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-black mb-1">
                    What Customers Are Complaining About
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Grouped by complaint theme with real customer quotes
                  </p>
                </div>
              </div>

              {/* Complaint Themes */}
              <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
                {themes.map((theme: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.08 }}
                    className={`pb-6 ${idx < themes.length - 1 ? "border-b border-red-500/10" : ""}`}
                  >
                    {/* Theme Header with count */}
                    <div className="mb-4">
                      <h3 className="text-sm sm:text-base font-black mb-2 flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg">{theme.emoji || "🔴"}</span>
                        <span>{theme.theme}</span>
                        <span className="text-red-300 text-xs sm:text-sm">
                          — {theme.mentions} mentions
                        </span>
                      </h3>
                      {theme.description && (
                        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                          {theme.description}
                        </p>
                      )}
                    </div>

                    {/* Verbatim Quotes */}
                    <div className="flex flex-col gap-3">
                      {(theme.quotes || []).map((quote: string, qIdx: number) => (
                        <div
                          key={qIdx}
                          className="px-3 sm:px-4 py-3 sm:py-4 bg-red-500/5 border-l-3 border-red-500/30 rounded text-xs sm:text-sm text-slate-200 italic leading-relaxed"
                        >
                          "{quote}"
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })()}

        {/* Coming Soon Sections - Factory Instruction Manual & Ads & Creative Hooks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sections.slice(1).map((s) => (
            <motion.div
              key={s.pillar}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/2.5 border border-white/7 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-lg"
            >
              <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-white/5 bg-gradient-to-r from-blue-500/6 to-transparent flex items-center gap-4">
                <div className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                  <s.icon size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-black mb-1">
                    {s.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {s.subtitle}
                  </p>
                </div>
              </div>
              <div className="px-6 sm:px-8 py-8 sm:py-10 flex items-center justify-center min-h-32">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-slate-400 mb-2">
                    🚀
                  </div>
                  <p className="text-sm sm:text-base text-slate-400 font-semibold">
                    Coming Soon
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Available in the next update
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-10 text-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 sm:px-9 py-3 sm:py-4 rounded-2xl text-sm sm:text-base text-slate-500 bg-white/3 border border-white/7 hover:bg-white/5 transition-colors no-underline"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

