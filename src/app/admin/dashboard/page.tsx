import { createClient } from "@/utils/supabase/server";

import { requireAdmin } from "../admin-guard";

function formatMoney(cents: number, currency = "USD") {
  const dollars = (cents ?? 0) / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(dollars);
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [profilesRes, paymentsRes, reportsRes] = await Promise.all([
    supabase.from("profiles").select("id"),
    supabase
      .from("payments")
      .select("amount_cents,status,currency,payment_date")
      .gte(
        "payment_date",
        new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000)
      )
      .order("payment_date", { ascending: false })
      .limit(500),
    supabase
      .from("reports")
      .select("id,created_at")
      .gte("created_at", todayStart.toISOString())
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const profiles = Array.isArray(profilesRes.data) ? profilesRes.data : [];
  const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
  const reports = Array.isArray(reportsRes.data) ? reportsRes.data : [];

  const totalUsers = profiles.length;
  const totalAnalysesToday = reports.length;

  const { data: profilesWithPlansData } = await supabase
    .from("profiles")
    .select("subscription_status")
    .limit(5000);

  const profilesWithPlans = Array.isArray(profilesWithPlansData)
    ? profilesWithPlansData
    : [];

  const activePlans = Array.from(
    new Set(
      profilesWithPlans
        .map((p) => p.subscription_status)
        .filter(Boolean)
    )
  ).length;

  const paidPayments = payments.filter((p) => p.status === "paid");
  const totalRevenueCents = paidPayments.reduce(
    (sum, p) => sum + (p.amount_cents ?? 0),
    0
  );
  const revenueCurrency = paidPayments[0]?.currency ?? "USD";

  const newUsersRes = await supabase
    .from("profiles")
    .select("id")
    .gte("created_at", todayStart.toISOString());
  const newUsersToday = Array.isArray(newUsersRes.data) ? newUsersRes.data : [];

  const pendingPaymentsCount = payments.filter((p) => p.status === "pending").length;

  const recentUsersRes = await supabase
    .from("profiles")
    .select("id,full_name,email,whatsapp_number,subscription_status,created_at,status")
    .order("created_at", { ascending: false })
    .limit(6);
  const recentUsers = Array.isArray(recentUsersRes.data) ? recentUsersRes.data : [];

  const recentPaymentsRes = await supabase
    .from("payments")
    .select("id,amount_cents,currency,status,payment_date,plan_id,user_id")
    .order("payment_date", { ascending: false })
    .limit(6);
  const recentPayments = Array.isArray(recentPaymentsRes.data) ? recentPaymentsRes.data : [];

  return (
    <div className="min-h-screen px-6 py-8 bg-[#0A0A0A] text-[#E5E7EB]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-[#A1A1AA] mt-1">Live overview from Supabase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Total Users</div>
            <div className="text-3xl font-extrabold mt-2">{totalUsers}</div>
          </div>
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Active Plans</div>
            <div className="text-3xl font-extrabold mt-2">{activePlans}</div>
          </div>
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Total Revenue (paid)</div>
            <div className="text-3xl font-extrabold mt-2">{formatMoney(totalRevenueCents, revenueCurrency)}</div>
          </div>
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">New Users Today</div>
            <div className="text-3xl font-extrabold mt-2">{newUsersToday.length}</div>
          </div>
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Pending Payments</div>
            <div className="text-3xl font-extrabold mt-2">{pendingPaymentsCount}</div>
          </div>
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Reports Today</div>
            <div className="text-3xl font-extrabold mt-2">{totalAnalysesToday}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 overflow-hidden">
            <div>
              <div className="text-sm font-extrabold">Recent Users</div>
              <div className="text-xs text-[#A1A1AA] mt-1">Latest profile signups</div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                    <th className="text-left py-2 pr-3">Name</th>
                    <th className="text-left py-2 pr-3">Email</th>
                    <th className="text-left py-2 pr-3">Plan</th>
                    <th className="text-left py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#A1A1AA]">No users</td>
                    </tr>
                  ) : (
                    recentUsers.map((u: any) => (
                      <tr key={u.id} className="border-b border-[#1F2937]/40">
                        <td className="py-3 pr-3 font-semibold">{u.full_name ?? "—"}</td>
                        <td className="py-3 pr-3 text-[#E5E7EB]/80">{u.email ?? "—"}</td>
                        <td className="py-3 pr-3">{u.subscription_status ?? "—"}</td>
                        <td className="py-3 pr-3">
                          <span
                            className={
                              "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide " +
                              (u.status === "active"
                                ? "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                                : "border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]")
                            }
                          >
                            {u.status ?? "active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 overflow-hidden">
            <div>
              <div className="text-sm font-extrabold">Recent Payments</div>
              <div className="text-xs text-[#A1A1AA] mt-1">Latest invoices/payments</div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                    <th className="text-left py-2 pr-3">Amount</th>
                    <th className="text-left py-2 pr-3">Date</th>
                    <th className="text-left py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[#A1A1AA]">No payments</td>
                    </tr>
                  ) : (
                    recentPayments.map((p: any) => (
                      <tr key={p.id} className="border-b border-[#1F2937]/40">
                        <td className="py-3 pr-3 font-semibold">{formatMoney(p.amount_cents ?? 0, p.currency ?? "USD")}</td>
                        <td className="py-3 pr-3 text-[#E5E7EB]/80">
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={
                              "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide " +
                              (p.status === "paid"
                                ? "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                                : p.status === "pending"
                                  ? "border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]"
                                  : "border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]")
                            }
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


