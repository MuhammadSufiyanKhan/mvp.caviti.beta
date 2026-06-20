"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Phone, Globe, UserCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium",
  "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia", "Cameroon",
  "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia",
  "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Maldives",
  "Mexico", "Moldova", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palestine",
  "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !whatsapp || !country || !password) {
      alert("Please fill in all fields!");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            whatsapp,
            country,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });
      if (error) {
        alert(error.message);
      } else {
        await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName }),
        });
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#1F2937] rounded-md focus:ring-2 focus:ring-violet-500/40 outline-none text-[#E5E7EB] placeholder:text-[#A1A1AA] text-sm";

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">

      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] border-r border-[#1F2937] p-12 flex-col justify-between">
        <div className="text-white text-2xl font-bold tracking-tighter">Caviti.io</div>
        <blockquote className="text-neutral-400 text-xl font-light italic">
          "Validate consumer demands dynamically."
        </blockquote>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12">
        <div className="max-w-sm w-full mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-neutral-500 mt-2 text-sm">Get started with Caviti.io</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">Last Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} required />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`} required>
                  <option value="" disabled>Select your country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} className="bg-neutral-900">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} minLength={6} required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white py-2.5 rounded-md font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              style={{
                background: loading ? "rgba(139,92,246,0.28)" : "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95))",
                boxShadow: "0 0 28px rgba(139,92,246,0.22)",
                opacity: loading ? 0.7 : 1,
              }}
            >

              {loading ? "Creating Account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[#A1A1AA]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E5E7EB] font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}