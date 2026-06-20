import { createClient } from "@/utils/supabase/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    // Get current user via authenticated session
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Not authenticated", details: "You must be logged in" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (ADMIN_EMAILS.length === 0) {
      return NextResponse.json(
        { error: "Admin configuration missing", details: "ADMIN_EMAILS environment variable not set" },
        { status: 500 }
      );
    }

    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied", details: `Your email (${user.email}) is not in the admin list` },
        { status: 403 }
      );
    }

    // Parse request body
    let userId: string;
    let action: string;
    try {
      const body = await request.json();
      userId = body.userId;
      action = body.action;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid request body", details: "Could not parse JSON" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!userId || !["ban", "unban"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid parameters", details: "userId and action are required. Action must be 'ban' or 'unban'" },
        { status: 400 }
      );
    }

    const newStatus = action === "ban" ? "banned" : "active";

    // Create admin client with service role key
    let adminSupabase;
    try {
      adminSupabase = createServiceRoleClient();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: "Failed to create admin client", details: errorMessage },
        { status: 500 }
      );
    }

    // Update user status
    let updateError;
    try {
      const result = await adminSupabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);
      updateError = result.error;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: "Failed to update user", details: errorMessage },
        { status: 500 }
      );
    }

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user status", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${action}ned successfully`,
      newStatus,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
