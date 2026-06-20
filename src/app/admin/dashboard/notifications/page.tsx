import { createClient } from "@/utils/supabase/server";

import { requireAdmin } from "../../admin-guard";

import NotificationsClient, {
  type AdminNotificationRow,
} from "./NotificationsClient";

export default async function AdminNotificationsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data } = await supabase
    .from("notifications")
    .select("id,title,message,level,is_read,created_at,read_at,user_id")
    .order("created_at", { ascending: false })
    .limit(5000);

  const rows = (Array.isArray(data) ? data : []) as AdminNotificationRow[];

  const unreadCount = rows.filter((n) => !n.is_read).length;

  return (
    <NotificationsClient initialUnreadCount={unreadCount} rows={rows} />
  );
}

