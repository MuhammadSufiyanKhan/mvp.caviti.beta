# TODO

## Goal: Debug Report Page empty data (SerpApi/Apify)

- [ ] Inspect the report generation / server action code path that populates `reports.market_data.analysis`.
- [ ] Update the relevant server action (currently `src/app/api/analyze-serpapi/route.ts`) with debug logging at:
  - [ ] Before calling the scraping API (log the search query + productName/keyword inputs).
  - [ ] After receiving raw API response (log full response shape safely).
  - [ ] After parsing (log the final extracted array/text sent to DB/UI).
- [ ] Improve error handling:
  - [ ] If API returns error/empty results, return a descriptive error message instead of an empty array.
- [ ] Add payload verification logging:
  - [ ] Log incoming request payload fields (productName / keyword / url) and confirm extracted productName is not undefined/empty.
- [ ] Ensure DB insert stores the parsed structure consistently with what the Report page expects (`parseSection`).
- [ ] Run a local Next.js build/lint/test command to verify TypeScript correctness.
