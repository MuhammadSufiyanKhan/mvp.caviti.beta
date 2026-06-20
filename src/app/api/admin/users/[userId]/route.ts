import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    console.log("[API] GET /api/admin/users/:userId - START");
    
    // Get current user via authenticated session
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    console.log("[API] Current user:", user?.email);

    if (userError || !user?.email) {
      console.log("[API] Auth error:", userError?.message);
      return NextResponse.json(
        { error: "Not authenticated", details: "You must be logged in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (ADMIN_EMAILS.length === 0) {
      console.log("[API] No admin emails configured");
      return NextResponse.json(
        { error: "Admin configuration missing", details: "ADMIN_EMAILS environment variable not set" },
        { status: 500 }
      );
    }

    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    console.log("[API] Is admin?", isAdmin, "Configured emails:", ADMIN_EMAILS);

    if (!isAdmin) {
      console.log("[API] User not admin, email:", user.email);
      return NextResponse.json(
        { error: "Access denied", details: `Your email (${user.email}) is not in the admin list` },
        { status: 403 }
      );
    }

    // Await params since it's a Promise in Next.js 16
    const resolvedParams = await params;
    const { userId } = resolvedParams;
    console.log("[API] Fetching user:", userId);

    // Create admin client with service role key
    let adminSupabase;
    try {
      adminSupabase = createServiceRoleClient();
      console.log("[API] Service role client created");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[API] Failed to create service role client:", errorMessage);
      return NextResponse.json(
        { error: "Failed to create admin client", details: errorMessage },
        { status: 500 }
      );
    }

    // Fetch user profile
    console.log("[API] Querying profiles table for user:", userId);
    let profile;
    let profileError;
    try {
      const result = await adminSupabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      profile = result.data;
      profileError = result.error;
      console.log("[API] Profile query result - error:", profileError?.message, "data:", profile?.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[API] Exception during profile query:", errorMessage);
      return NextResponse.json(
        { error: "Failed to fetch profile", details: errorMessage },
        { status: 500 }
      );
    }

    if (profileError) {
      console.log("[API] Profile error from Supabase:", profileError.message);
      return NextResponse.json(
        { error: "User not found", details: profileError.message },
        { status: 404 }
      );
    }

    if (!profile) {
      console.log("[API] Profile is null");
      return NextResponse.json(
        { error: "User profile is empty", details: "Profile exists but has no data" },
        { status: 404 }
      );
    }

    console.log("[API] Profile found, fetching email from auth.users");

    // Fetch email from auth.users and merge with profile
    try {
      const authResult = await adminSupabase.auth.admin.getUserById(userId);
      if (authResult.data?.user?.email) {
        profile.email = authResult.data.user.email;
        console.log("[API] Added email from auth.users:", authResult.data.user.email);
      }
      if (!profile.full_name && authResult.data?.user?.user_metadata?.full_name) {
        profile.full_name = authResult.data.user.user_metadata.full_name;
        console.log("[API] Added full_name from auth metadata");
      }
    } catch (err) {
      console.warn("[API] Could not fetch from auth.users:", err);
    }

    console.log("[API] Profile found, fetching reports count");

    // Fetch reports count
    let reportsCount = 0;
    try {
      const result = await adminSupabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      reportsCount = result.count ?? 0;
      console.log("[API] Reports count:", reportsCount);
    } catch (err) {
      console.warn("[API] Failed to fetch reports count:", err);
      // Continue even if reports fetch fails
    }

    console.log("[API] Fetching payments");

    // Fetch payments
    let payments = [];
    try {
      const result = await adminSupabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("payment_date", { ascending: false })
        .limit(10);
      payments = result.data ?? [];
      console.log("[API] Payments count:", payments.length);
    } catch (err) {
      console.warn("[API] Failed to fetch payments:", err);
      // Continue even if payments fetch fails
    }

    const response = {
      success: true,
      profile,
      reportsCount,
      payments,
    };

    console.log("[API] Returning response with profile:", profile.id);
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[API] Unexpected error:", errorMessage, error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
