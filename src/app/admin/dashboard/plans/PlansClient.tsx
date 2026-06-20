"use client";

import { useMemo, useState } from "react";

export type AdminPlanRow = {
  id: string;
  plan_key: string | null;
  name: string | null;
  monthly_price_cents: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  features?: string | null;
};

type FormState = {
  id?: string;
  name: string;
  plan_key: string;
  monthly_price_cents: string;
  duration_days: string;
  features: string;
  is_active: boolean;
};

function formatMoney(cents: number | null | undefined) {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function toNumberOrZero(s: string) {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export default function PlansClient({
  plans,
}: {
  plans: AdminPlanRow[];
}) {
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    plan?: AdminPlanRow;
  }>({ open: false, mode: "add" });

  const [form, setForm] = useState<FormState>({
    name: "",
    plan_key: "",
    monthly_price_cents: "0",
    duration_days: "30",
    features: "",
    is_active: true,
  });

  const enrichedPlans = useMemo(() => plans, [plans]);

  function openAdd() {
    setForm({
      name: "",
      plan_key: "",
      monthly_price_cents: "0",
      duration_days: "30",
      features: "",
      is_active: true,
    });
    setModal({ open: true, mode: "add" });
  }

  function openEdit(plan: AdminPlanRow) {
    setForm({
      id: plan.id,
      name: plan.name ?? "",
      plan_key: plan.plan_key ?? "",
      monthly_price_cents:
        plan.monthly_price_cents == null ? "0" : String(plan.monthly_price_cents),
      duration_days: "30",
      features: plan.features ?? "",
      is_active: Boolean(plan.is_active),
    });
    setModal({ open: true, mode: "edit", plan });
  }

  function closeModal() {
    setModal((m) => ({ ...m, open: false }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    closeModal();
  }

  function removePlan(_plan: AdminPlanRow) {
    // Stub UI for delete.
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Plans</h2>
          <p className="text-sm text-[#A1A1AA] mt-1">Add/edit/delete (stub UI)</p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/30 px-4 py-2 text-sm font-extrabold hover:bg-[#3b82f6]/25"
        >
          Add New Plan
        </button>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#A1A1AA]">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4">Features</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrichedPlans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#A1A1AA]">
                    No plans.
                  </td>
                </tr>
              ) : (
                enrichedPlans.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#1F2937]/40 align-top"
                  >
                    <td className="py-4 px-4 font-semibold">{p.name ?? "—"}</td>
                    <td className="py-4 px-4 text-[#E5E7EB]/80">{formatMoney(p.monthly_price_cents)}</td>
                    <td className="py-4 px-4 text-[#E5E7EB]/80">30 days</td>
                    <td className="py-4 px-4 text-[#E5E7EB]/80">
                      {p.features ? (
                        <div className="max-w-[420px] whitespace-pre-wrap">{p.features}</div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-3 py-1 text-xs font-extrabold text-[#60a5fa]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removePlan(p)}
                          className="rounded-lg border border-[#fb7185]/25 bg-[#fb7185]/10 px-3 py-1 text-xs font-extrabold text-[#fb7185]"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-2xl rounded-xl border border-[#1F2937] bg-[#0A0A0A] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-extrabold">
                  {modal.mode === "add" ? "Add New Plan" : "Edit Plan"}
                </div>
                <div className="text-xs text-[#A1A1AA] mt-1">Wire-up to server actions/APIs later.</div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[#1F2937] bg-white/5 px-3 py-1 text-xs font-extrabold text-[#E5E7EB] hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-extrabold">Plan Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                    placeholder="e.g. Starter"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-extrabold">Price (cents)</label>
                  <input
                    value={form.monthly_price_cents}
                    onChange={(e) => setForm((f) => ({ ...f, monthly_price_cents: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                    placeholder="e.g. 1900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-extrabold">Duration (days)</label>
                  <input
                    value={form.duration_days}
                    onChange={(e) => setForm((f) => ({ ...f, duration_days: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                    placeholder="30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-extrabold">Plan Key</label>
                  <input
                    value={form.plan_key}
                    onChange={(e) => setForm((f) => ({ ...f, plan_key: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none"
                    placeholder="starter_monthly"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-extrabold">Features</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-[#1F2937] bg-white/5 px-3 py-2 text-sm outline-none min-h-28"
                  placeholder="One feature per line..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/30 px-4 py-3 text-sm font-extrabold text-[#60a5fa] hover:bg-[#3b82f6]/25"
                >
                  {modal.mode === "add" ? "Create Plan" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-[#1F2937] bg-white/5 px-4 py-3 text-sm font-extrabold text-[#E5E7EB] hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>

              <div className="text-xs text-[#A1A1AA]">Preview: {formatMoney(toNumberOrZero(form.monthly_price_cents))}</div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

