"use client";

import type { ReactNode } from "react";

import { AdminToaster, ToastFromQuery } from "./toast-admin-client";
import { ClientProviders } from "@/app/providers";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
      <AdminToaster />
      <ToastFromQuery />
      {children}
    </ClientProviders>
  );
}


