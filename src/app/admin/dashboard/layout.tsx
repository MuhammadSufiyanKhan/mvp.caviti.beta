import type { ReactNode } from "react";

import { AdminToaster, ToastFromQuery } from "../../admin/toast-admin-client";
import { AdminSidebarProvider } from "../../admin/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <AdminToaster />
      <ToastFromQuery />
      <AdminSidebarProvider>{children}</AdminSidebarProvider>
    </>
  );
}

