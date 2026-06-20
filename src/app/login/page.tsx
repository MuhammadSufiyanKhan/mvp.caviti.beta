"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#1F2937] p-12 flex-col justify-between">
        <div className="text-white text-2xl font-bold tracking-tighter">Caviti.io</div>
        <blockquote className="text-neutral-400 text-xl font-light italic">
          "Validate consumer demands dynamically."
        </blockquote>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
            <p className="text-neutral-500 mt-2">Welcome back to Caviti.io</p>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#1F2937] bg-[#0A0A0A] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA]"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#1F2937] bg-[#0A0A0A] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-md font-semibold transition flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95))",
                boxShadow: "0 0 28px rgba(139,92,246,0.22)",
              }}
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <button className="w-full border py-2.5 rounded-md font-medium hover:bg-neutral-50 transition">
            Or continue with Google
          </button>

          <p className="text-center text-sm text-[#A1A1AA]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#E5E7EB] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
