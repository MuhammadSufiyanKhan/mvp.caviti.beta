"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/utils/supabase/client";

// Note: This page is client-only on purpose per task requirements.
export default function AdminSettingsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [adminEmail, setAdminEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setAdminEmail(data.user?.email ?? "");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const adminEmailsEnv =
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").trim() || "";
  const adminEmails = useMemo(() => {
    if (!adminEmailsEnv) return [];
    return adminEmailsEnv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [adminEmailsEnv]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    if (password !== confirm) return;

    setSaving(true);
    try {
      // Stub: wire to Supabase auth updatePassword when ready.
      // await supabase.auth.updateUser({ password });
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">Admin profile & security</p>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 space-y-5">
        <div>
          <div className="text-sm font-extrabold">Admin Profile</div>
          <div className="text-[#E5E7EB]/80 mt-1">
            {loading ? "Loading..." : adminEmail || "—"}
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-extrabold">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-extrabold">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-4 py-3 text-sm font-extrabold text-[#60a5fa] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Change Password"}
            </button>
          </div>

          <p className="text-xs text-[#A1A1AA]">
            Password update is stubbed until wired to Supabase auth.
          </p>
        </form>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 space-y-5">
        <div>
          <div className="text-sm font-extrabold">Site Settings</div>
          <div className="text-[#E5E7EB]/80 mt-1">
            ADMIN_EMAILS:{" "}
            {adminEmails.length ? adminEmails.join(", ") : "—"}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 space-y-5">
        <div>
          <div className="text-sm font-extrabold">Danger Zone</div>
          <div className="text-[#E5E7EB]/80 mt-1">Sign out of admin session.</div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-lg border border-[#fb7185]/25 bg-[#fb7185]/10 px-4 py-3 text-sm font-extrabold text-[#fb7185] hover:bg-[#fb7185]/15"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}


