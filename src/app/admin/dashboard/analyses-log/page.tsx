import { createClient } from "@/utils/supabase/server";

import { requireAdmin } from "../../admin-guard";

import AnalysesLogClient, {
  type AdminReportRow,
} from "./AnalysesLogClient";

export default async function AdminAnalysesLogPage({
  searchParams,
}: {
  searchParams?: { q?: string; date?: string };
}) {
  await requireAdmin();

  const supabase = await createClient();

  const q = (searchParams?.q ?? "").trim();
  const date = (searchParams?.date ?? "").trim();

  const query = supabase
    .from("reports")
    .select("id,user_id,product_name,created_at")
    .order("created_at", { ascending: false });

  const { data } = await (q
    ? query.or(`user_id.ilike.%${q}%,product_name.ilike.%${q}%`)
    : query);

  const rows = (Array.isArray(data) ? data : []) as AdminReportRow[];

  // Client will apply date filter UI; keep this for server-side narrowing if needed.
  return (
    <AnalysesLogClient
      initialQ={q}
      initialDate={date}
      rows={rows}
    />
  );
}

