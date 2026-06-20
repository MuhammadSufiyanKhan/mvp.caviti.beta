"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function parseAdminEmails(input: string | undefined): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function adminSignIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user?.email) {
    // Redirect back with message in query string.
    redirect(
      `/admin?toast=error&message=${encodeURIComponent(error?.message ?? "Invalid login")}`
    );
  }

  const adminEmails = parseAdminEmails(process.env.ADMIN_EMAILS);
  const userEmail = data.user.email.toLowerCase();

  if (!adminEmails.includes(userEmail)) {
    // Not an admin: do not allow admin area access.
    redirect(
      `/admin?toast=error&message=${encodeURIComponent(
        "Not authorized as admin"
      )}`
    );
  }

  redirect("/admin/dashboard");
}

