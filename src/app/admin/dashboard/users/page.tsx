import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { requireAdmin } from "../../admin-guard";

import UsersClient from "./UsersClient";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const adminUser = await requireAdmin();
  console.log("[Server] Admin page loaded for user:", adminUser.email);

  let supabase;
  try {
    supabase = createServiceRoleClient();
    console.log("[Server] Service role client created successfully");
  } catch (err) {
    console.error("[Server] Failed to create service role client:", err);
    throw new Error("Failed to initialize admin client");
  }

  // Await searchParams since it's a Promise in Next.js 16
  const params = await searchParams;
  const q = (params?.q ?? "").trim();

  const baseQuery = supabase
    .from("profiles")
    .select(
      "id,full_name,email,whatsapp_number,subscription_status,created_at,status"
    )
    .order("created_at", { ascending: false })
    .limit(5000);

  console.log("[Server] Executing query with q:", q);
  const { data: rows, error: queryError } = q
    ? await baseQuery.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    : await baseQuery;

  if (queryError) {
    console.error("[Server] Query error:", queryError.message);
    throw new Error(`Failed to fetch users: ${queryError.message}`);
  }

  console.log("[Server] Rows returned:", rows?.length ?? 0);
  if (rows && rows.length > 0) {
    console.log("[Server] First row:", JSON.stringify(rows[0], null, 2));
    console.log("[Server] All user IDs:", rows.map((r) => r.id).slice(0, 5));
  } else {
    console.error("[Server] WARNING: No users returned! Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }

  let users = Array.isArray(rows) ? rows : [];

  // Supplement email from auth.users if not in profiles
  console.log("[Server] Fetching email data from auth.users");
  try {
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error("[Server] Auth error:", authError.message);
    } else if (authUsers && authUsers.length > 0) {
      console.log("[Server] Fetched", authUsers.length, "users from auth");
      // Create email map from auth
      const emailMap = new Map(authUsers.map(u => [u.id, u.email]));
      // Supplement users with email from auth if missing
      users = users.map(u => ({
        ...u,
        email: u.email || emailMap.get(u.id) || "",
      }));
      console.log("[Server] Supplemented email for users from auth.users");
      // Log first user after supplementation
      if (users.length > 0) {
        console.log("[Server] First user after supplement:", JSON.stringify({
          id: users[0].id,
          email: users[0].email,
          full_name: users[0].full_name,
        }, null, 2));
      }
    }
  } catch (err) {
    console.warn("[Server] Could not fetch from auth.users:", err);
  }

  return <UsersClient initialQ={q} users={users as any} />;
}

