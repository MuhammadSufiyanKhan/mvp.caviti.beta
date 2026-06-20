import { createClient } from "@/utils/supabase/server";

import { requireAdmin } from "../../admin-guard";

import SendMessageClient, {
  type AdminProfileRow,
} from "./SendMessageClient";

export default async function AdminSendMessagePage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id,email,whatsapp_number")
    .order("created_at", { ascending: false })
    .limit(5000);

  const users = (Array.isArray(data) ? data : []) as AdminProfileRow[];

  return <SendMessageClient users={users} />;
}

