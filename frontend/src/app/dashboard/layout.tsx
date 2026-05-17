"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { section: "Overview", items: [
    { href: "/dashboard", label: "Dashboard", icon: "◻" },
  ]},
  { section: "Management", items: [
    { href: "/billing", label: "Billing Accounts", icon: "▤" },
    { href: "/analytics", label: "Analytics", icon: "◈" },
    { href: "/alerts", label: "Alerts", icon: "△" },
  ]},
  { section: "Settings", items: [
    { href: "/settings", label: "Settings", icon: "⚙" },
  ]},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-[--sidebar-w] z-50
                   bg-[var(--bg-raised)] border-r border-[var(--border)] flex flex-col"
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-12 border-b border-[var(--border)]">
          <div className="w-6 h-6 rounded bg-[var(--brand)] flex items-center justify-center text-[10px] font-bold text-white">
            F
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">FinOps</div>
            <div className="text-[10px] text-[var(--text-dim)] leading-tight">Acme Corp</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                {section.section}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2 px-2.5 py-1.5 text-sm rounded transition-colors",
                        isActive
                          ? "bg-[rgba(88,166,255,0.1)] text-[var(--brand)] font-medium"
                          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)]"
                      )}
                    >
                      <span className="text-xs w-4 text-center">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
          <span className="text-[11px] text-[var(--text-dim)]">All systems normal</span>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[--sidebar-w] flex-1 min-h-screen">
        <div className="p-6 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
