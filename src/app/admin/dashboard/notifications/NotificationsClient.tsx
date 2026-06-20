"use client";

import { useMemo, useState } from "react";

export type AdminNotificationRow = {
  id: string;
  title: string | null;
  message: string | null;
  level: string | null;
  is_read: boolean | null;
  created_at: string | null;
  read_at: string | null;
  user_id: string | null;
};

export default function NotificationsClient({
  initialUnreadCount,
  rows,
}: {
  initialUnreadCount: number;
  rows: AdminNotificationRow[];
}) {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [optimisticReadIds, setOptimisticReadIds] = useState<Set<string>>(
    () => new Set()
  );

  const mergedRows = useMemo(() => {
    if (optimisticReadIds.size === 0) return rows;
    return rows.map((n) => {
      const marked = optimisticReadIds.has(n.id);
      if (!marked) return n;
      return { ...n, is_read: true };
    });
  }, [rows, optimisticReadIds]);

  function markAllAsRead() {
    const unreadIds = rows.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setOptimisticReadIds((prev) => {
      const next = new Set(prev);
      unreadIds.forEach((id) => next.add(id));
      return next;
    });
    setUnreadCount(0);
  }

  function clearAll() {
    // Stubbed: requires server action / API route.
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Notifications</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">{unreadCount} unread notifications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <button
          type="button"
          onClick={markAllAsRead}
          className="rounded-lg border border-[#1F2937] bg-white/5 px-4 py-2 text-sm font-extrabold text-[#E5E7EB] hover:bg-white/10"
        >
          Mark all as read
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-[#fb7185]/25 bg-[#fb7185]/10 px-4 py-2 text-sm font-extrabold text-[#fb7185] hover:bg-[#fb7185]/15"
        >
          Clear all (stub)
        </button>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Level</th>
                <th className="text-left py-3 px-4">
                  Status
                  {unreadCount > 0 ? (
                    <span className="ml-2 inline-flex items-center rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-[#fbbf24]">
                      {unreadCount} unread
                    </span>
                  ) : null}
                </th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mergedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#A1A1AA]">
                    No notifications.
                  </td>
                </tr>
              ) : (
                mergedRows.map((n) => {
                  const isRead = Boolean(n.is_read);
                  return (
                    <tr key={n.id} className="border-b border-[#1F2937]/40">
                      <td className="py-3 px-4 font-semibold">{n.title ?? "—"}</td>
                      <td className="py-3 px-4 text-[#E5E7EB]/80">{n.message ?? "—"}</td>
                      <td className="py-3 px-4">{n.level ?? "—"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            "inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide " +
                            (isRead
                              ? "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                              : "border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]")
                          }
                        >
                          {isRead ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#E5E7EB]/80">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (isRead) return;
                            setOptimisticReadIds((prev) => {
                              const next = new Set(prev);
                              next.add(n.id);
                              return next;
                            });
                            setUnreadCount((c) => Math.max(0, c - 1));
                          }}
                          className="rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-3 py-1 text-xs font-extrabold text-[#60a5fa]"
                        >
                          Mark read
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

