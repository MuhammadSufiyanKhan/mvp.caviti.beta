import { createClient } from "@/utils/supabase/server";

import { requireAdmin } from "../../admin-guard";

import PlansClient, { type AdminPlanRow } from "./PlansClient";

export default async function AdminPlansPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data } = await supabase
    .from("plans")
    .select("id,plan_key,name,monthly_price_cents,is_active,created_at,updated_at,features")
    .order("created_at", { ascending: false });

  const plans = (Array.isArray(data) ? data : []) as AdminPlanRow[];

  return <PlansClient plans={plans} />;
}

