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
  Rocket,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { parseSection } from "@/lib/report-metrics";
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Loading...");

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

  const analysisText = (report?.market_data as any)?.analysis || "";
  const marketData = report?.market_data as any;

  // If report doesn't have real_reviews, fetch them automatically
  useEffect(() => {
    if (!report) return;

    const enrichData = async () => {
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
          color: "#3b82f6",
          glow: "rgba(59,130,246,0.06)",
          border: "rgba(59,130,246,0.15)",
          accent: "rgba(59,130,246,0.1)",
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
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(5,5,8,0.85)",
          backdropFilter: "blur(24px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#475569",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
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
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "#10b981",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.15)",
              padding: "6px 14px",
              borderRadius: "100px",
            }}
          >
            {shouldBlurGlobal ? `Status: ${subscriptionStatus}` : "✓ Analysis Complete"}
          </span>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "28px" }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-2px",
              marginBottom: "10px",
              textTransform: "capitalize",
            }}
          >
            {report.product_name}
          </h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#475569",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "6px 14px",
                borderRadius: "8px",
              }}
            >
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  color: "#60a5fa",
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={12} />
                {String(marketData.url)
                  .replace(/^https?:\/\//, "")
                  .slice(0, 50)}
              </a>
            ) : null}
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {sections.map((s) => (
            <PillarCard
              key={s.pillar}
              pillar={s.pillar}
              title={s.title}
              subtitle={s.subtitle}
              icon={s.icon}
              theme={s.theme}
              items={s.items}
              shouldBlurGlobal={shouldBlurGlobal}
              subscriptionStatus={subscriptionStatus}
            />
          ))}
        </div>

        {/* Complaint Themes Section - Verbatim Quotes from Real Reviews */}
        {(marketDataWithReviews || marketData)?.complaint_themes && (marketDataWithReviews || marketData).complaint_themes.length > 0 && (() => {
          const themes = (marketDataWithReviews || marketData).complaint_themes;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                marginTop: "36px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "22px",
                overflow: "hidden",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "22px 28px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "linear-gradient(135deg, rgba(239,68,68,0.06), transparent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "13px",
                    background: "rgba(239,68,68,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(239,68,68,0.15)",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>⭐</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      marginBottom: "3px",
                    }}
                  >
                    What Customers Are Complaining About
                  </h2>
                  <p style={{ fontSize: "13px", color: "#475569" }}>
                    Grouped by complaint theme with real customer quotes
                  </p>
                </div>
              </div>

              {/* Complaint Themes */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {themes.map((theme: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.08 }}
                    style={{
                      paddingBottom: "20px",
                      borderBottom: idx < themes.length - 1 ? "1px solid rgba(239,68,68,0.1)" : "none",
                    }}
                  >
                    {/* Theme Header with count */}
                    <div style={{ marginBottom: "14px" }}>
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: 900,
                          margin: 0,
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>{theme.emoji || "🔴"}</span>
                        <span>{theme.theme}</span>
                        <span style={{ color: "#f87171", fontSize: "14px" }}>
                          — {theme.mentions} mentions
                        </span>
                      </h3>
                      {theme.description && (
                        <p style={{
                          fontSize: "13px",
                          color: "#cbd5e1",
                          margin: "6px 0 0 0",
                          lineHeight: "1.4"
                        }}>
                          {theme.description}
                        </p>
                      )}
                    </div>

                    {/* Verbatim Quotes */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(theme.quotes || []).map((quote: string, qIdx: number) => (
                        <div
                          key={qIdx}
                          style={{
                            padding: "12px 14px",
                            background: "rgba(239,68,68,0.05)",
                            borderLeft: "3px solid rgba(239,68,68,0.3)",
                            borderRadius: "6px",
                            fontSize: "13px",
                            color: "#e2e8f0",
                            fontStyle: "italic",
                            lineHeight: "1.5",
                          }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: "28px", textAlign: "center" }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#475569",
              fontSize: "14px",
              textDecoration: "none",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "13px 36px",
              borderRadius: "14px",
            }}
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

