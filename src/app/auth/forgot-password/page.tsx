"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0A0A]">
        <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#1F2937] p-8 xl:p-12 flex-col justify-between">
          <div className="text-white text-xl sm:text-2xl font-bold tracking-tighter">Caviti.io</div>
          <blockquote className="text-neutral-400 text-lg sm:text-xl font-light italic">
            "Validate consumer demands dynamically."
          </blockquote>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-24 py-8 sm:py-12">
          <div className="max-w-sm w-full mx-auto space-y-6 sm:space-y-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Check Your Email</h2>
              <p className="text-neutral-500 mt-2 text-sm sm:text-base">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <p className="text-neutral-400 text-sm">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Back to Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0A0A]">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#1F2937] p-8 xl:p-12 flex-col justify-between">
        <div className="text-white text-xl sm:text-2xl font-bold tracking-tighter">Caviti.io</div>
        <blockquote className="text-neutral-400 text-lg sm:text-xl font-light italic">
          "Validate consumer demands dynamically."
        </blockquote>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-24 py-8 sm:py-12">
        <div className="max-w-sm w-full mx-auto space-y-6 sm:space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Reset Password</h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#1F2937] bg-[#0A0A0A] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA] disabled:opacity-50 transition text-sm sm:text-base"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2.5 rounded-md font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95))",
                boxShadow: "0 0 28px rgba(139,92,246,0.22)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-[#A1A1AA]">
            Remember your password?{" "}
            <Link href="/login" className="text-[#E5E7EB] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
