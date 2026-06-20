import * as cheerio from "cheerio";

export interface ScrapeResult {
  url: string;
  title: string;
  text: string;
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function scrapeWebsite(input: string): Promise<ScrapeResult> {
  const url = normalizeUrl(input);

  const response = await fetch(url, {
    headers: {
      // Realistic browser headers to reduce 403 blocks
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      // Some servers key off these hints
      Referer: "https://www.google.com/",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Upgrade-Insecure-Requests": "1",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL (${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, svg, iframe").remove();

  const title = $("title").text().trim() || new URL(url).hostname;
  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000);

  if (text.length < 100) {
    throw new Error("Insufficient content scraped from URL");
  }

  return { url, title, text };
}
