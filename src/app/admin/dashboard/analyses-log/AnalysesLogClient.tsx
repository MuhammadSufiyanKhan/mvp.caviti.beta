"use client";

import { useMemo, useState } from "react";

export type AdminReportRow = {
  id: string;
  user_id: string | null;
  product_name: string | null;
  created_at: string | null;
};

// Back-compat alias (some pages expect AdminReportRow naming)
export type AdminAnalysesLogRow = AdminReportRow;

type DateFilter = "" | "7d" | "30d" | "all";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function matchesDateFilter(createdAt: string | null, filter: DateFilter) {
  if (!createdAt) return false;
  if (!filter || filter === "all") return true;

  const dt = new Date(createdAt);
  const now = new Date();

  const from =
    filter === "7d"
      ? startOfDay(new Date(now.getTime() - 7 * 86400000))
      : startOfDay(new Date(now.getTime() - 30 * 86400000));
  const to = startOfDay(now);

  return dt.getTime() >= from.getTime() &&
    dt.getTime() <= to.getTime() + 86400000 - 1;
}

export default function AnalysesLogClient({
  initialQ,
  initialDate,
  rows,
}: {
  initialQ: string;
  initialDate: string;
  rows: AdminAnalysesLogRow[];
}) {
  const [q, setQ] = useState(initialQ);
  const [dateFilter, setDateFilter] = useState<DateFilter>(
    (initialDate as DateFilter) || ""
  );

  const filtered = useMemo(() => {
    const query = (q ?? "").trim().toLowerCase();

    return rows.filter((r) => {
      const user = (r.user_id ?? "").toLowerCase();
      const product = (r.product_name ?? "").toLowerCase();
      const matchesQuery = !query || user.includes(query) || product.includes(query);
      const matchesDate = matchesDateFilter(r.created_at, dateFilter);
      return matchesQuery && matchesDate;
    });
  }, [rows, q, dateFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Analyses Log</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">All product analyses</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div className="flex-1">
          <label className="text-xs font-extrabold uppercase tracking-wide text-[#A1A1AA]">
            Search user email / product
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email or product name"
            className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <label className="text-xs font-extrabold uppercase tracking-wide text-[#A1A1AA]">
            Date
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="mt-2 w-full rounded-lg border border-[#1F2937] bg-[#0A0A0A] px-3 py-2 text-sm outline-none"
          >
            <option value="">Any</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                <th className="text-left py-3 px-4">User Email</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[#A1A1AA]">
                    No analyses.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[#1F2937]/40">
                    <td className="py-3 px-4 font-semibold">{r.user_id ?? "—"}</td>
                    <td className="py-3 px-4 text-[#E5E7EB]/80">{r.product_name ?? "—"}</td>
                    <td className="py-3 px-4 text-[#E5E7EB]/80">
                      {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex rounded-full border border-[#34d399]/30 bg-[#34d399]/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#34d399]">
                        done
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

