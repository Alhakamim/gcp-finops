"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useLang } from "@/lib/lang-context";

// ── Translations ──
const T: Record<string, Record<string, string>> = {
  pageTitle: { en: "Dashboard", ar: "لوحة التحكم" },
  pageSub: { en: "GCP cost & resource overview", ar: "نظرة عامة على تكاليف وموارد GCP" },
  export: { en: "Export", ar: "تصدير" },
  sync: { en: "Sync Now", ar: "مزامنة" },

  currentMonth: { en: "Current Month", ar: "الشهر الحالي" },
  projected: { en: "Projected", ar: "المتوقع" },
  lastMonth: { en: "Last Month", ar: "الشهر الماضي" },
  activeResources: { en: "Active Resources", ar: "الموارد النشطة" },
  ofBudget: { en: "of budget", ar: "من الميزانية" },
  dayAvg: { en: "/ day avg", ar: "متوسط اليوم" },
  decrease: { en: "decrease", ar: "انخفاض" },

  budgetUsage: { en: "Monthly Budget Usage", ar: "استخدام الميزانية الشهرية" },
  accounts: { en: "accounts", ar: "حسابات" },
  projects: { en: "projects", ar: "مشاريع" },
  remaining: { en: "Remaining", ar: "المتبقي" },
  dailyAvg: { en: "Daily Avg", ar: "المتوسط اليومي" },
  last7d: { en: "Last 7d", ar: "آخر 7 أيام" },

  monthlyCostTrend: { en: "Monthly Cost Trend", ar: "اتجاه التكاليف الشهرية" },
  months12: { en: "12 months", ar: "12 شهر" },
  topServices: { en: "Top Services", ar: "أهم الخدمات" },
  thisMonth: { en: "This month", ar: "هذا الشهر" },

  recentAlerts: { en: "Recent Alerts", ar: "آخر التنبيهات" },
  new: { en: "new", ar: "جديد" },
  dailyCost: { en: "Daily Cost · Last 30 days", ar: "التكاليف اليومية · آخر 30 يوم" },
  total: { en: "total", ar: "المجموع" },

  recentInvoices: { en: "Recent Invoices", ar: "آخر الفواتير" },
  viewAll: { en: "View All", ar: "عرض الكل" },
  invoice: { en: "Invoice", ar: "الفاتورة" },
  account: { en: "Account", ar: "الحساب" },
  date: { en: "Date", ar: "التاريخ" },
  amount: { en: "Amount", ar: "المبلغ" },
  status: { en: "Status", ar: "الحالة" },
  pending: { en: "pending", ar: "قيد الانتظار" },
  paid: { en: "paid", ar: "مدفوع" },

  alert1Title: { en: "Budget threshold reached", ar: "تم الوصول لحد الميزانية" },
  alert1Msg: { en: "Main Production at 90% of $80k budget", ar: "الإنتاج الرئيسي عند 90% من ميزانية 80 ألف $" },
  alert2Title: { en: "Cost anomaly detected", ar: "تم اكتشاف شذوذ في التكلفة" },
  alert2Msg: { en: "Compute Engine costs spiked 86% in us-central1", ar: "تكاليف Compute Engine ارتفعت 86% في us-central1" },
  alert3Title: { en: "New recommendation", ar: "توصية جديدة" },
  alert3Msg: { en: "Reserved instances could save $1,200/mo", ar: "الحجوزات المحجوزة قد توفر 1200$ شهريًا" },
};

const t = (key: string, lang: string) => T[key]?.[lang] || key;

// ── Mock Data ──
const MONTHLY_DATA = [
  { month: "Jan", monthAr: "يناير", cost: 45200, budget: 50000 },
  { month: "Feb", monthAr: "فبراير", cost: 48100, budget: 50000 },
  { month: "Mar", monthAr: "مارس", cost: 52300, budget: 50000 },
  { month: "Apr", monthAr: "أبريل", cost: 49800, budget: 50000 },
  { month: "May", monthAr: "مايو", cost: 56200, budget: 50000 },
  { month: "Jun", monthAr: "يونيو", cost: 68100, budget: 50000 },
  { month: "Jul", monthAr: "يوليو", cost: 62300, budget: 50000 },
  { month: "Aug", monthAr: "أغسطس", cost: 58900, budget: 50000 },
  { month: "Sep", monthAr: "سبتمبر", cost: 61200, budget: 50000 },
  { month: "Oct", monthAr: "أكتوبر", cost: 64500, budget: 50000 },
  { month: "Nov", monthAr: "نوفمبر", cost: 45232, budget: 50000 },
];

const DAILY_COSTS = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  cost: Math.round(1200 + Math.random() * 1800),
}));

const SERVICES = [
  { name: "Compute Engine", ar: "Compute Engine", cost: 18230, pct: 32.1, change: "+5.2%" },
  { name: "Cloud Storage", ar: "Cloud Storage", cost: 8920, pct: 15.7, change: "-2.1%" },
  { name: "BigQuery", ar: "BigQuery", cost: 6541, pct: 11.5, change: "+12.4%" },
  { name: "Cloud SQL", ar: "Cloud SQL", cost: 5230, pct: 9.2, change: "+3.8%" },
  { name: "GKE", ar: "GKE", cost: 4890, pct: 8.6, change: "+8.1%" },
  { name: "Cloud Networking", ar: "Cloud Networking", cost: 3451, pct: 6.1, change: "-1.5%" },
];

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4", "#ec4899"];

const FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function DashboardPage() {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const tr = (key: string) => t(key, lang);
  const isRtl = lang === "ar";
  const monthKey = isRtl ? "monthAr" : "month";

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">{tr("pageTitle")}</h1>
          <p className="text-sm text-[var(--text-dim)]">{tr("pageSub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn">{isRtl ? "⬇" : "⬇"} {tr("export")}</button>
          <button className="btn-primary text-xs">{tr("sync")}</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="stat">
          <div className="stat-label">{tr("currentMonth")}</div>
          <div className="stat-value">{FORMAT.format(45232)}</div>
          <div className="stat-sub">56.5% {tr("ofBudget")}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{tr("projected")}</div>
          <div className="stat-value">{FORMAT.format(67250)}</div>
          <div className="stat-sub">{FORMAT.format(1507)} {tr("dayAvg")}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{tr("lastMonth")}</div>
          <div className="stat-value">{FORMAT.format(68120)}</div>
          <div className="stat-sub" style={{ color: "var(--success)" }}>▼ 33.6% {tr("decrease")}</div>
        </div>
        <div className="stat">
          <div className="stat-label">{tr("activeResources")}</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">12 services · 3 anomalies</div>
        </div>
      </div>

      {/* Budget Bar */}
      <div className="card p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="stat-label">{tr("budgetUsage")}</div>
            <div className="text-xs text-[var(--text-dim)] mt-0.5">
              4 {tr("accounts")} · 13 {tr("projects")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{FORMAT.format(45232)}</div>
            <div className="text-xs text-[var(--text-dim)]">{tr("ofBudget")} {FORMAT.format(80000)}</div>
          </div>
        </div>
        <div className="h-1.5 bg-[var(--bg-inset)] rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: "56.5%" }} />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: tr("remaining"), value: FORMAT.format(34768) },
            { label: tr("projected"), value: FORMAT.format(67250) },
            { label: tr("dailyAvg"), value: FORMAT.format(1507) },
            { label: tr("last7d"), value: FORMAT.format(11200) },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-sm font-semibold">{s.value}</div>
              <div className="text-[10px] text-[var(--text-dim)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-3">
        <div className="card p-4 col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{tr("monthlyCostTrend")}</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">{tr("months12")}</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} barGap={2}>
                <XAxis dataKey={monthKey} axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#21262d", border: "1px solid #30363d", borderRadius: "6px", fontSize: "12px" }} labelStyle={{ color: "#e6edf3" }} />
                <Bar dataKey="budget" fill="#21262d" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cost" fill="#58a6ff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{tr("topServices")}</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">{tr("thisMonth")}</span>
          </div>
          <div className="space-y-2.5">
            {SERVICES.slice(0, 6).map((svc, i) => (
              <div key={svc.name} className="flex items-center gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                <span className={`flex-1 text-[var(--text-muted)] ${isRtl ? "text-right" : ""}`}>{svc.name}</span>
                <div className="w-16 h-1 bg-[var(--bg-inset)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${svc.pct}%`, background: COLORS[i] }} />
                </div>
                <span className="font-medium w-14 text-right">{FORMAT.format(svc.cost)}</span>
                <span className={`w-10 text-right ${svc.change.startsWith("+") ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                  {svc.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Daily Chart */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold">{tr("recentAlerts")}</h3>
            <span className="badge-danger text-[10px]">3 {tr("new")}</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              { severity: "high", key: "alert1Title", msgKey: "alert1Msg", time: "2h ago" },
              { severity: "medium", key: "alert2Title", msgKey: "alert2Msg", time: "6h ago" },
              { severity: "low", key: "alert3Title", msgKey: "alert3Msg", time: "1d ago" },
            ].map((alert) => (
              <div key={alert.key} className="px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-start gap-2.5" style={{ flexDirection: isRtl ? "row-reverse" : "row" }}>
                  <span className={`mt-0.5 text-xs ${
                    alert.severity === "high" ? "text-[var(--danger)]" :
                    alert.severity === "medium" ? "text-[var(--warning)]" : "text-[var(--brand)]"
                  }`}>●</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{tr(alert.key)}</div>
                    <div className="text-xs text-[var(--text-dim)]">{tr(alert.msgKey)}</div>
                    <div className="text-[10px] text-[var(--text-dim)] mt-0.5">{alert.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{tr("dailyCost")}</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">{FORMAT.format(45232)} {tr("total")}</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_COSTS}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 9 }} interval={4} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 9 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#21262d", border: "1px solid #30363d", borderRadius: "6px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="cost" stroke="#58a6ff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold">{tr("recentInvoices")}</h3>
          <button className="btn text-[10px]">{tr("viewAll")}</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {[tr("invoice"), tr("account"), tr("date"), tr("amount"), tr("status")].map((h) => (
                <th key={h} className="table-header text-left px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {[
              { inv: "INV-001", acc: "Main Production", accAr: "الإنتاج الرئيسي", date: "May 1, 2026", amount: FORMAT.format(45232), status: "pending" },
              { inv: "INV-002", acc: "Dev & Staging", accAr: "التطوير والتجربة", date: "May 1, 2026", amount: FORMAT.format(8920), status: "paid" },
              { inv: "INV-003", acc: "Client Alpha", accAr: "العميل ألفا", date: "May 1, 2026", amount: FORMAT.format(12450), status: "paid" },
              { inv: "INV-004", acc: "ML Research", accAr: "أبحاث التعلم الآلي", date: "May 1, 2026", amount: FORMAT.format(18320), status: "paid" },
            ].map((row) => (
              <tr key={row.inv} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-4 py-2 text-sm">{row.inv}</td>
                <td className="px-4 py-2 text-sm text-[var(--text-muted)]">{isRtl ? row.accAr : row.acc}</td>
                <td className="px-4 py-2 text-sm text-[var(--text-muted)]">{row.date}</td>
                <td className="px-4 py-2 text-sm font-medium">{row.amount}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${row.status === "paid" ? "badge-success" : "badge-warning"}`}>
                    {row.status === "paid" ? tr("paid") : tr("pending")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
