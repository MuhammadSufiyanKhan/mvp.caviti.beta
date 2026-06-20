import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
to: email, // apna email hardcode karo, // temporary test
      subject: "Welcome to Caviti.io! 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #050508; color: white; padding: 40px; border-radius: 16px;">
          
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 32px; font-weight: 900; margin: 0 0 8px; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              Welcome to Caviti.io
            </h1>
            <p style="color: #64748b; font-size: 15px; margin: 0;">AI-Powered Market Intelligence</p>
          </div>

          <div style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.15); border-radius: 16px; padding: 28px; margin-bottom: 28px;">
            <h2 style="color: white; font-size: 20px; font-weight: 700; margin: 0 0 8px;">
              Hey ${firstName || "there"}! 👋
            </h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 0;">
              Your account has been created successfully. You now have access to AI-powered market gap analysis to help you find untapped opportunities.
            </p>
          </div>

          <div style="margin-bottom: 28px;">
            <h3 style="color: white; font-size: 16px; font-weight: 700; margin: 0 0 16px;">What you can do with Caviti:</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px;">
                <span style="font-size: 20px;">🔍</span>
                <div>
                  <p style="color: white; font-size: 13px; font-weight: 600; margin: 0 0 2px;">Analyze Any Product</p>
                  <p style="color: #475569; font-size: 12px; margin: 0;">Enter a product name or competitor URL</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px;">
                <span style="font-size: 20px;">📊</span>
                <div>
                  <p style="color: white; font-size: 13px; font-weight: 600; margin: 0 0 2px;">Get Real Market Data</p>
                  <p style="color: #475569; font-size: 12px; margin: 0;">Live Google Shopping & Search data</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px;">
                <span style="font-size: 20px;">🚀</span>
                <div>
                  <p style="color: white; font-size: 13px; font-weight: 600; margin: 0 0 2px;">Entry Strategies</p>
                  <p style="color: #475569; font-size: 12px; margin: 0;">Actionable plans to enter any market</p>
                </div>
              </div>
            </div>
          </div>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard"
            style="display: block; text-align: center; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; margin-bottom: 28px; box-shadow: 0 0 30px rgba(59,130,246,0.3);">
            Go to Dashboard →
          </a>

          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; text-align: center;">
            <p style="color: #1e293b; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Caviti.io — AI-Powered Market Intelligence
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Welcome email error:", err);
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}