export interface AnalysisResult {
  data_points: number;
  gaps_found: number;
  confidence_score: number;
  market_signal_strength: number;
  insights: [string, string, string];
}

export interface ReportMarketData extends AnalysisResult {
  url?: string;
  /** @deprecated legacy markdown analysis */
  analysis?: string;
}

export function parseMarketData(data: unknown): ReportMarketData | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (
    typeof d.data_points === "number" &&
    typeof d.gaps_found === "number" &&
    typeof d.confidence_score === "number" &&
    typeof d.market_signal_strength === "number" &&
    Array.isArray(d.insights) &&
    d.insights.length >= 3
  ) {
    return {
      url: typeof d.url === "string" ? d.url : undefined,
      data_points: d.data_points as number,
      gaps_found: d.gaps_found as number,
      confidence_score: d.confidence_score as number,
      market_signal_strength: d.market_signal_strength as number,
      insights: [String(d.insights[0]), String(d.insights[1]), String(d.insights[2])],
      analysis: typeof d.analysis === "string" ? d.analysis : undefined,
    };
  }
  return null;
}

export function isAnalysisComplete(data: unknown): boolean {
  return parseMarketData(data) !== null;
}
