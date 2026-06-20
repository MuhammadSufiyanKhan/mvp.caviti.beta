"use client";

import { useMemo, useState } from "react";

export type AdminProfileRow = {
  id: string;
  email: string | null;
  whatsapp_number: string | number | null;
};

function buildWaLink(whatsappNumber: string | number | null, message: string) {
  if (!whatsappNumber) return "#";
  const num = String(whatsappNumber).replace(/\s+/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${num}?text=${encoded}`;
}

export default function SendMessageClient({
  users,
}: {
  users: AdminProfileRow[];
}) {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users[0]?.id ?? ""
  );
  const [sendToAll, setSendToAll] = useState(false);
  const [message, setMessage] = useState("");

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId) ?? null;
  }, [users, selectedUserId]);

  const waHref = buildWaLink(
    sendToAll ? null : selectedUser?.whatsapp_number ?? null,
    message
  );

  const emailHref = useMemo(() => {
    if (sendToAll) return "mailto:?";
    const email = selectedUser?.email;
    if (!email) return "mailto:?";
    const encodedSubject = encodeURIComponent("Message");
    const encodedBody = encodeURIComponent(message);
    return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  }, [sendToAll, selectedUser, message]);

  const canSend = message.trim().length > 0 && (sendToAll || !!selectedUser);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Send Message</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Send WhatsApp via wa.me and email via your email provider.
        </p>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-extrabold">Recipient</label>

            <div className="mt-2 flex items-center gap-3">
              <input
                id="sendToAll"
                type="checkbox"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                className="h-4 w-4 accent-[#60a5fa]"
              />
              <label htmlFor="sendToAll" className="text-sm font-black">
                Send to All Users
              </label>
            </div>

            {!sendToAll ? (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="mt-3 w-full rounded-lg border border-[#1F2937] bg-[#0A0A0A] px-3 py-2 text-sm outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email ?? "—"}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-[#A1A1AA] mt-2">
                Bulk send is stubbed (WhatsApp/email buttons will target the
                selected user only).
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-extrabold">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#1F2937] bg-[#0A0A0A] px-3 py-2 text-sm outline-none min-h-32"
              placeholder="Write your message..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!canSend || sendToAll) e.preventDefault();
            }}
            className={
              "flex-1 rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-4 py-3 text-center text-sm font-extrabold text-[#60a5fa] " +
              (!canSend || sendToAll ? "opacity-50 cursor-not-allowed" : "")
            }
          >
            Send WhatsApp
          </a>

          <a
            href={emailHref}
            onClick={(e) => {
              if (!canSend || sendToAll) e.preventDefault();
            }}
            className={
              "flex-1 rounded-lg border border-[#34d399]/25 bg-[#34d399]/10 px-4 py-3 text-center text-sm font-extrabold text-[#34d399] " +
              (!canSend || sendToAll ? "opacity-50 cursor-not-allowed" : "")
            }
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

