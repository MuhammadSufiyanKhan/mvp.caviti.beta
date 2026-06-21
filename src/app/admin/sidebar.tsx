"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  MessageSquare,
  Package,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
  {
    href: "/admin/dashboard/payments",
    label: "Payments & Invoices",
    icon: CreditCard,
  },
  { href: "/admin/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/dashboard/send-message", label: "Send Message", icon: MessageSquare },
  { href: "/admin/dashboard/plans", label: "Plans", icon: Package },
  { href: "/admin/dashboard/analyses-log", label: "Analyses Log", icon: Search },

  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

function logoutHref() {
  // Uses normal user logout route if you have one.
  // Otherwise, you can implement a /logout route.
  return "/";
}

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header with Toggle */}
      <div className="sticky top-0 z-50 flex md:hidden items-center justify-between bg-[#0A0A0A] border-b border-white/10 px-4 py-3">
        <div className="text-sm font-extrabold tracking-tight text-white">Caviti.io</div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl relative">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 md:top-0 left-0 h-screen w-64 border-r bg-[#0A0A0A] transition-transform duration-300 ease-in-out z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="px-5 py-6 hidden md:block">
            <div className="text-sm font-extrabold tracking-tight text-white">Admin</div>
            <div className="mt-1 text-xs text-neutral-500">Caviti.io</div>
          </div>

          <nav className="px-3">
            {nav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={
                    "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition " +
                    (isActive
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white")
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Link
              href={logoutHref()}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <section className="flex-1 w-full md:w-auto">{children}</section>
      </div>
    </div>
  );
}

