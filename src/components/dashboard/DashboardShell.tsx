"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumb?: string;
  action?: React.ReactNode;
}

const navLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function DashboardShell({ children, breadcrumb = "Dashboard", action }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-foreground">
              Caviti.io
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm text-muted">{breadcrumb}</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
              Home
            </Link>
          </nav>

          {action}
        </div>
      </header>

      <main className={cn("mx-auto max-w-6xl px-6 py-12 md:py-16")}>{children}</main>
    </div>
  );
}
