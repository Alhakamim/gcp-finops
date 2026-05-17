"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Lang, LangContext } from "@/lib/lang-context";

const T: Record<string, Record<Lang, string>> = {
  overview: { en: "Overview", ar: "نظرة عامة" },
  management: { en: "Management", ar: "الإدارة" },
  settings: { en: "Settings", ar: "الإعدادات" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  billing: { en: "Billing Accounts", ar: "حسابات الفوترة" },
  analytics: { en: "Analytics", ar: "التحليلات" },
  alerts: { en: "Alerts", ar: "التنبيهات" },
  settingsPage: { en: "Settings", ar: "الإعدادات" },
  allSystemsNormal: { en: "All systems normal", ar: "جميع الأنظمة طبيعية" },
  acmeCorp: { en: "Acme Corp", ar: "أكسي كورب" },
  finops: { en: "FinOps", ar: "فين أوبس" },
};

const NAV_ITEMS: { section: string; sectionKey: string; items: { href: string; labelKey: string; icon: string }[] }[] = [
  {
    sectionKey: "overview",
    section: "overview",
    items: [{ href: "/dashboard", labelKey: "dashboard", icon: "◻" }],
  },
  {
    sectionKey: "management",
    section: "management",
    items: [
      { href: "/billing", labelKey: "billing", icon: "▤" },
      { href: "/analytics", labelKey: "analytics", icon: "◈" },
      { href: "/alerts", labelKey: "alerts", icon: "△" },
    ],
  },
  {
    sectionKey: "settings",
    section: "settings",
    items: [{ href: "/settings", labelKey: "settingsPage", icon: "⚙" }],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (collapsed) {
      document.documentElement.classList.add("sidebar-collapsed");
    } else {
      document.documentElement.classList.remove("sidebar-collapsed");
    }
  }, [collapsed]);

  const t = (key: Lang) => T[key]?.[lang] || key;

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="flex min-h-screen" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
        {/* Sidebar Toggle Button (always visible) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="fixed z-[60] top-3 transition-all btn"
          style={{
            [lang === "ar" ? "right" : "left"]: collapsed ? "8px" : "calc(var(--sidebar-w) - 32px)",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "☰" : "✕"}
        </button>

        {/* Sidebar */}
        <aside
          className="fixed top-0 bottom-0 z-50 flex flex-col transition-all duration-150 bg-[var(--bg-raised)] border-[var(--border)]"
          style={{
            [lang === "ar" ? "right" : "left"]: 0,
            width: collapsed ? "56px" : "var(--sidebar-w)",
            borderInlineEnd: "1px solid var(--border)",
          }}
        >
          {/* Brand */}
          <div
            className="flex items-center gap-2.5 px-4 h-12 border-b border-[var(--border)]"
            style={{ justifyContent: collapsed ? "center" : lang === "ar" ? "flex-end" : "flex-start" }}
          >
            <div className="w-6 h-6 rounded bg-[var(--brand)] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              F
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold leading-tight sidebar-text">{t("finops" as Lang)}</div>
                <div className="text-[10px] text-[var(--text-dim)] leading-tight sidebar-text">{t("acmeCorp" as Lang)}</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
            {NAV_ITEMS.map((section) => (
              <div key={section.sectionKey}>
                {!collapsed && (
                  <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] sidebar-section-title">
                    {t(section.sectionKey as Lang)}
                  </div>
                )}
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
                            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)]",
                          collapsed && "justify-center px-1"
                        )}
                        title={collapsed ? t(item.labelKey as Lang) : undefined}
                      >
                        <span className="text-xs flex-shrink-0">{item.icon}</span>
                        {!collapsed && <span className="sidebar-text">{t(item.labelKey as Lang)}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div className="px-4 py-3 border-t border-[var(--border)] flex items-center gap-2 sidebar-text">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] flex-shrink-0" />
              <span className="text-[11px] text-[var(--text-dim)]">{t("allSystemsNormal" as Lang)}</span>
            </div>
          )}
        </aside>

        {/* Main */}
        <main
          className="flex-1 min-h-screen transition-all duration-150"
          style={{
            marginInlineStart: collapsed ? "56px" : "var(--sidebar-w)",
          }}
        >
          {/* Top bar with language switch */}
          <div
            className="sticky top-0 z-40 flex items-center justify-end gap-2 px-6 py-2 border-b border-[var(--border)] glass"
          >
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="btn text-xs"
            >
              {lang === "en" ? "🇸🇦 العربية" : "🇬🇧 English"}
            </button>
          </div>

          <div className="p-6 max-w-[1400px]">{children}</div>
        </main>
      </div>
    </LangContext.Provider>
  );
}
