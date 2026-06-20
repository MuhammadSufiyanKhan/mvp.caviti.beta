"use client";

import { useMemo, useState, useEffect } from "react";

export type AdminUserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp_number: string | number | null;
  subscription_status: string | null;
  created_at: string | null;
  status: string | null;
};

export default function UsersClient({
  initialQ,
  users: initialUsers,
}: {
  initialQ: string;
  users: AdminUserRow[];
}) {
  const [q, setQ] = useState(initialQ);
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DEBUG: Check if users have IDs
  useEffect(() => {
    if (initialUsers.length > 0) {
      const hasIds = initialUsers.some((u) => u.id);
      const allIds = initialUsers.map((u, i) => ({ idx: i, id: u.id, email: u.email }));
      console.log("[Client] Users loaded:", initialUsers.length, "Have IDs:", hasIds);
      console.log("[Client] User details (first 5):", allIds.slice(0, 5));
      
      if (!hasIds) {
        console.error(
          "[Client] CRITICAL: No users have IDs! This means SUPABASE_SERVICE_ROLE_KEY is likely not set."
        );
      }
    }
  }, [initialUsers]);

  const filtered = useMemo(() => {
    const query = (q ?? "").trim().toLowerCase();
    if (!query) return users;

    return users.filter((u) => {
      const fullName = (u.full_name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [q, users]);

  const handleBanUnban = async (userId: string, isCurrentlyActive: boolean) => {
    setLoading(userId);
    try {
      const action = isCurrentlyActive ? "ban" : "unban";
      const response = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details || data.error || "Failed to update user status";
        throw new Error(errorMessage);
      }

      // Update the users list
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, status: data.newStatus } : u
        )
      );

      // Update selected user details if viewing
      if (selectedUser === userId && userDetails) {
        setUserDetails({
          ...userDetails,
          profile: { ...userDetails.profile, status: data.newStatus },
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to update user status";
      alert(`Error: ${errorMsg}\n\nMake sure:\n- ADMIN_EMAILS is set in .env.local\n- SUPABASE_SERVICE_ROLE_KEY is set in .env.local\n- Dev server has been restarted`);
    } finally {
      setLoading(null);
    }
  };

  const handleViewUser = async (userId: string) => {
    console.log("[Admin Dashboard] handleViewUser called with userId:", userId, "Type:", typeof userId);
    
    // STRICT validation - reject any falsy or undefined values
    if (!userId || userId === "undefined" || userId.trim() === "") {
      const errorMsg = "Cannot fetch user - invalid or missing user ID";
      console.error("[Admin Dashboard]", errorMsg, "received:", userId);
      setError(errorMsg);
      setSelectedUser(null);
      return;
    }

    setSelectedUser(userId);
    setDetailsLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      console.error("[Admin Dashboard] Request timeout after 10 seconds");
      setError("Request timeout - API took too long to respond");
      setDetailsLoading(false);
      setSelectedUser(null);
    }, 10000); // 10 second timeout

    try {
      const url = `/api/admin/users/${userId}`;
      console.log("[Admin Dashboard] Fetching from URL:", url);
      const response = await fetch(url);
      clearTimeout(timeoutId);
      
      console.log("[Admin Dashboard] Response status:", response.status, response.ok);
      
      const data = await response.json();
      console.log("[Admin Dashboard] Response data:", data);
      
      if (!response.ok) {
        const errorMessage = data.details || data.error || "Failed to fetch user details";
        console.error("[Admin Dashboard] API error:", errorMessage);
        throw new Error(errorMessage);
      }

      // Check if we got valid profile data
      if (!data.profile) {
        console.error("[Admin Dashboard] No profile in response:", data);
        throw new Error(data.error || "No user profile returned from API");
      }
      
      console.log("[Admin Dashboard] Successfully loaded user:", data.profile.id);
      setUserDetails(data);
      setDetailsLoading(false);
    } catch (error) {
      clearTimeout(timeoutId);
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch user details";
      console.error("[Admin Dashboard] Error:", errorMsg);
      setError(errorMsg);
      setSelectedUser(null);
      setDetailsLoading(false);
    }
  };

  if (selectedUser && error) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedUser(null);
            setError(null);
          }}
          className="text-sm text-[#60a5fa] hover:underline mb-4"
        >
          ← Back to Users
        </button>

        <div className="rounded-xl border border-[#fb7185]/50 bg-[#fb7185]/10 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#fb7185]">Error Loading User Details</h3>
            <p className="text-sm text-[#fb7185]/80 mt-2">{error}</p>
          </div>

          <div className="bg-[#0A0A0A] rounded-lg p-4 text-xs font-mono text-[#E5E7EB] space-y-2">
            <p>
              <strong>Troubleshooting:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#A1A1AA]">
              <li>Check if ADMIN_EMAILS is set in .env.local</li>
              <li>Verify SUPABASE_SERVICE_ROLE_KEY is set in .env.local</li>
              <li>Make sure dev server has been restarted after .env.local changes</li>
              <li>Check browser console for more details</li>
              <li>Verify you are logged in as the admin user</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedUser(null);
              setError(null);
            }}
            className="px-4 py-2 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-lg text-sm font-bold text-[#60a5fa] hover:bg-[#3b82f6]/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedUser && detailsLoading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedUser(null);
          }}
          className="text-sm text-[#60a5fa] hover:underline mb-4"
        >
          ← Back to Users
        </button>
        <div className="rounded-xl border border-[#1F2937] bg-white/5 p-6 text-center">
          <p className="text-[#A1A1AA]">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (selectedUser && userDetails) {
    const profile = userDetails.profile;
    const isActive = (profile.status ?? "active") === "active";

    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedUser(null);
            setUserDetails(null);
            setError(null);
          }}
          className="text-sm text-[#60a5fa] hover:underline mb-4"
        >
          ← Back to Users
        </button>

        <div className="rounded-xl border border-[#1F2937] bg-white/5 p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {profile.full_name || "No Name"}
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-1">{profile.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">
                Status
              </p>
              <p className="mt-1">
                <span
                  className={
                    "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide " +
                    (isActive
                      ? "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                      : "border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]")
                  }
                >
                  {isActive ? "Active" : "Banned"}
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">
                Plan
              </p>
              <p className="mt-1 font-semibold">{profile.subscription_status || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">
                Joined
              </p>
              <p className="mt-1 font-semibold">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">
                Reports Generated
              </p>
              <p className="mt-1 font-semibold">{userDetails.reportsCount}</p>
            </div>

            {profile.whatsapp_number && (
              <div>
                <p className="text-xs text-[#A1A1AA] uppercase tracking-wide">
                  WhatsApp
                </p>
                <p className="mt-1">
                  <a
                    href={`https://wa.me/${profile.whatsapp_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#60a5fa] hover:underline font-semibold"
                  >
                    {profile.whatsapp_number}
                  </a>
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Recent Payments</h3>
            {userDetails.payments.length > 0 ? (
              <div className="space-y-2">
                {userDetails.payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-[#1F2937]/40"
                  >
                    <div>
                      <p className="font-semibold">{payment.amount_cents / 100} {payment.currency}</p>
                      <p className="text-xs text-[#A1A1AA]">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={
                        "text-xs font-bold uppercase " +
                        (payment.status === "paid"
                          ? "text-[#34d399]"
                          : payment.status === "pending"
                            ? "text-[#f59e0b]"
                            : "text-[#fb7185]")
                      }
                    >
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#A1A1AA]">No payments found</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() =>
                handleBanUnban(profile.id, isActive)
              }
              disabled={loading === profile.id}
              className="rounded-lg border border-[#fb7185]/25 bg-[#fb7185]/10 px-4 py-2 text-sm font-extrabold text-[#fb7185] hover:bg-[#fb7185]/20 disabled:opacity-50"
            >
              {loading === profile.id
                ? "Processing..."
                : isActive
                  ? "Ban User"
                  : "Unban User"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: if selectedUser is set but we don't have data/error/loading
  if (selectedUser) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedUser(null);
            setUserDetails(null);
            setError(null);
            setDetailsLoading(false);
          }}
          className="text-sm text-[#60a5fa] hover:underline mb-4"
        >
          ← Back to Users
        </button>

        <div className="rounded-xl border border-[#fb7185]/50 bg-[#fb7185]/10 p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#fb7185]">Unexpected State</h3>
          <p className="text-sm text-[#fb7185]/80">
            Something unexpected happened. The page is in a loading or error state but no data was received.
          </p>
          <button
            onClick={() => {
              setSelectedUser(null);
              setUserDetails(null);
              setError(null);
              setDetailsLoading(false);
            }}
            className="px-4 py-2 bg-[#3b82f6]/20 border border-[#3b82f6]/30 rounded-lg text-sm font-bold text-[#60a5fa] hover:bg-[#3b82f6]/30"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Users</h2>
          <p className="text-sm text-[#A1A1AA] mt-1">Manage users and subscriptions</p>
        </div>
      </div>

      {/* Keep GET-based search UI for consistency with the rest of the dashboard */}
      <form
        method="get"
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
      >
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          className="w-full sm:w-96 rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/30 px-4 py-2 text-sm font-extrabold hover:bg-[#3b82f6]/25"
        >
          Search
        </button>
      </form>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">WhatsApp</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#A1A1AA]">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  // Ensure we have a valid ID - fallback to email if id is missing
                  const userId = u.id || u.email || `user-${idx}`;
                  const wa = u.whatsapp_number ? String(u.whatsapp_number) : "";
                  const isActive = (u.status ?? "active") === "active";
                  const waHref = wa ? `https://wa.me/${wa}` : "#";

                  if (!u.id) {
                    console.warn("[Admin Dashboard] User object missing ID at index", idx, '- Object:', u);
                  }

                  return (
                    <tr key={userId} className="border-b border-[#1F2937]/40">
                      <td className="py-3 px-4 font-semibold">{u.full_name ?? "—"}</td>
                      <td className="py-3 px-4 text-[#E5E7EB]/80">{u.email ?? "—"}</td>
                      <td className="py-3 px-4">
                        {wa ? (
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#60a5fa] hover:underline font-semibold"
                          >
                            WhatsApp
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4">{u.subscription_status ?? "—"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide " +
                            (isActive
                              ? "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                              : "border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]")
                          }
                        >
                          {isActive ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#E5E7EB]/80">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <form
                          onSubmit={(e) => e.preventDefault()}
                          className="inline-flex gap-2"
                        >
                          <button
                            onClick={() => {
                              console.log("[Admin Dashboard] View button clicked - userId:", userId, "User email:", u.email);
                              handleViewUser(userId);
                            }}
                            disabled={detailsLoading}
                            className="rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-3 py-1 text-xs font-extrabold text-[#60a5fa] hover:bg-[#3b82f6]/20 disabled:opacity-50"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleBanUnban(userId, isActive)
                            }
                            disabled={loading === userId}
                            className="rounded-lg border border-[#fb7185]/25 bg-[#fb7185]/10 px-3 py-1 text-xs font-extrabold text-[#fb7185] hover:bg-[#fb7185]/20 disabled:opacity-50"
                            type="button"
                          >
                            {loading === userId
                              ? "..."
                              : isActive
                                ? "Ban"
                                : "Unban"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note: Ban/Unban + details modal are stubbed in UI until you confirm exact server-action routes. */}
    </div>
  );
}

