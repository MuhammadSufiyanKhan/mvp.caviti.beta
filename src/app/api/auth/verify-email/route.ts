import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { token, type } = await request.json();

    if (!token || !type) {
      return NextResponse.json(
        { error: "Token and type are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (type === "email_verification") {
      const { error } = await supabase.auth.verifyOtp({
        email: "",
        token,
        type: "email",
      });

      if (error) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: "Email verified successfully" });
    }

    if (type === "password_reset") {
      const { newPassword } = await request.json();

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return NextResponse.json(
          { error: "Failed to reset password" },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, message: "Password reset successfully" });
    }

    return NextResponse.json(
      { error: "Invalid token type" },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Token verification error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
