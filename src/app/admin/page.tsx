"use client";

import { useState } from "react";
import { adminSignIn } from "./actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Admin Sign In</h2>
            <p className="text-neutral-500 mt-2">Access the admin dashboard</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              adminSignIn(email, password);
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-[#1F2937] bg-[#0A0A0A] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA]"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-[#1F2937] bg-[#0A0A0A] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white py-2.5 rounded-md font-semibold transition"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95))",
                boxShadow: "0 0 28px rgba(139,92,246,0.22)",
              }}
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-[#A1A1AA]">
            Use your admin credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

