"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import UserMenu from "@/components/UserMenu";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
              Caviti.io
            </Link>
            <span className="hidden sm:inline text-border">/</span>
            <span className="hidden sm:inline text-xs sm:text-sm text-muted truncate">{breadcrumb}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="text-xs sm:text-sm text-muted transition-colors hover:text-foreground">
              Home
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>

            {/* Action Button */}
            {action && <div className="hidden sm:block">{action}</div>}

            {/* User Avatar Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col px-4 py-3 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                className="text-sm text-muted transition-colors hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16")}>{children}</main>
    </div>
  );
}
