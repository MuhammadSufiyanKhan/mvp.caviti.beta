export function parseSection(text: string, heading: string): string[] {
  if (!text) return [];
  const regex = new RegExp(`## ${heading}([\\s\\S]*?)(?=## |$)`);
  const match = text.match(regex);
  if (!match) return [];
  return match[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.replace("- ", "").trim());
}

export function computeConfidenceScore(
  negativePoints: string[],
  marketGaps: string[],
  entryStrategies: string[]
): number {
  const total = negativePoints.length + marketGaps.length + entryStrategies.length;
  if (total === 0) return 0;
  return Math.min(98, Math.round(68 + total * 4.2));
}

export function buildTrendData(reportId: string) {
  const labels = ["Start", "+30s", "+1m", "+2m", "+3m", "Complete"];
  const seed = reportId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return labels.map((label, i) => {
    const progress = i / (labels.length - 1);
    const wave = Math.sin((seed % 10) + i * 0.8) * 8;
    const intensity = Math.round(
      Math.min(100, Math.max(8, 12 + progress * 72 + wave + (i === labels.length - 1 ? 12 : 0)))
    );
    return { label, intensity };
  });
}

export function isReportProcessing(analysis: string | undefined): boolean {
  if (!analysis) return true;
  return analysis === "Generating analysis..." || analysis.trim().length < 20;
}
