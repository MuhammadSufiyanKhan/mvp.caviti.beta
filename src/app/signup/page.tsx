"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, UserCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields!");
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName }),
        });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA] text-sm disabled:opacity-50 transition";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0A0A0A]">

      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#1F2937] p-8 xl:p-12 flex-col justify-between">
        <div className="text-white text-xl sm:text-2xl font-bold tracking-tighter">Caviti.io</div>
        <blockquote className="text-neutral-400 text-lg sm:text-xl font-light italic">
          "Validate consumer demands dynamically."
        </blockquote>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-24 py-8 sm:py-12">
        <div className="max-w-sm w-full mx-auto space-y-4 sm:space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-neutral-500 mt-2 text-xs sm:text-sm">Get started with Caviti.io</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-200 text-xs sm:text-sm">
              {error}
            </div>
          )}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} className={inputClass} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">Last Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} className={inputClass} required />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className={inputClass} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className={inputClass} minLength={6} required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white py-2.5 rounded-md font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm sm:text-base"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95))",
                boxShadow: "0 0 28px rgba(139,92,246,0.22)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-[#A1A1AA]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E5E7EB] font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}