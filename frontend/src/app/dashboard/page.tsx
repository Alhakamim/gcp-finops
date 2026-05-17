"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

// ── Mock Data ──
const MONTHLY_DATA = [
  { month: "Jan", cost: 45200, budget: 50000 },
  { month: "Feb", cost: 48100, budget: 50000 },
  { month: "Mar", cost: 52300, budget: 50000 },
  { month: "Apr", cost: 49800, budget: 50000 },
  { month: "May", cost: 56200, budget: 50000 },
  { month: "Jun", cost: 68100, budget: 50000 },
  { month: "Jul", cost: 62300, budget: 50000 },
  { month: "Aug", cost: 58900, budget: 50000 },
  { month: "Sep", cost: 61200, budget: 50000 },
  { month: "Oct", cost: 64500, budget: 50000 },
  { month: "Nov", cost: 45232, budget: 50000 },
];

const DAILY_COSTS = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  cost: Math.round(1200 + Math.random() * 1800),
}));

const SERVICES = [
  { name: "Compute Engine", cost: 18230, pct: 32.1, change: "+5.2%" },
  { name: "Cloud Storage", cost: 8920, pct: 15.7, change: "-2.1%" },
  { name: "BigQuery", cost: 6541, pct: 11.5, change: "+12.4%" },
  { name: "Cloud SQL", cost: 5230, pct: 9.2, change: "+3.8%" },
  { name: "GKE", cost: 4890, pct: 8.6, change: "+8.1%" },
  { name: "Cloud Networking", cost: 3451, pct: 6.1, change: "-1.5%" },
  { name: "Other", cost: 9571, pct: 16.8, change: "+2.3%" },
];

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4", "#ec4899", "#6e7681"];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--text-dim)]">GCP cost & resource overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn">⬇ Export</button>
          <button className="btn-primary text-xs">Sync Now</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="stat">
          <div className="stat-label">Current Month</div>
          <div className="stat-value">$45,232</div>
          <div className="stat-sub">56.5% of $80k budget</div>
        </div>
        <div className="stat">
          <div className="stat-label">Projected</div>
          <div className="stat-value">$67,250</div>
          <div className="stat-sub">$1,507 / day avg</div>
        </div>
        <div className="stat">
          <div className="stat-label">Last Month</div>
          <div className="stat-value">$68,120</div>
          <div className="stat-sub" style={{ color: "var(--success)" }}>▼ 33.6% decrease</div>
        </div>
        <div className="stat">
          <div className="stat-label">Active Resources</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">12 services · 3 anomalies</div>
        </div>
      </div>

      {/* Budget Bar */}
      <div className="card p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-semibold">
              Monthly Budget Usage
            </div>
            <div className="text-xs text-[var(--text-dim)] mt-0.5">
              4 billing accounts · 13 projects
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">$45,232</div>
            <div className="text-xs text-[var(--text-dim)]">of $80,000 budget</div>
          </div>
        </div>
        <div className="h-1.5 bg-[var(--bg-inset)] rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: "56.5%" }} />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Remaining", value: "$34,768" },
            { label: "Projected", value: "$67,250" },
            { label: "Daily Avg", value: "$1,507" },
            { label: "Last 7d", value: "$11,200" },
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
        {/* Monthly Trend */}
        <div className="card p-4 col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Monthly Cost Trend</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">12 months</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} barGap={2}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6e7681", fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#21262d", border: "1px solid #30363d", borderRadius: "6px", fontSize: "12px" }}
                  labelStyle={{ color: "#e6edf3" }}
                />
                <Bar dataKey="budget" fill="#21262d" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cost" fill="#58a6ff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services */}
        <div className="card p-4 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Top Services</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">This month</span>
          </div>
          <div className="space-y-2.5">
            {SERVICES.slice(0, 6).map((svc, i) => (
              <div key={svc.name} className="flex items-center gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                <span className="flex-1 text-[var(--text-muted)]">{svc.name}</span>
                <div className="w-16 h-1 bg-[var(--bg-inset)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${svc.pct}%`, background: COLORS[i] }} />
                </div>
                <span className="font-medium w-14 text-right">${(svc.cost / 1000).toFixed(1)}k</span>
                <span className={`w-10 text-right ${svc.change.startsWith("+") ? "text-[var(--danger)]" : "text-[var(--success)]"}`}>
                  {svc.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Alerts + Recent Activity */}
      <div className="grid grid-cols-2 gap-3">
        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold">Recent Alerts</h3>
            <span className="badge-danger text-[10px]">3 new</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              { severity: "high", title: "Budget threshold reached", msg: "Main Production at 90% of $80k budget", time: "2h ago" },
              { severity: "medium", title: "Cost anomaly detected", msg: "Compute Engine costs spiked 86% in us-central1", time: "6h ago" },
              { severity: "low", title: "New recommendation", msg: "Reserved instances could save $1,200/mo", time: "1d ago" },
            ].map((alert) => (
              <div key={alert.title} className="px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 text-xs ${
                    alert.severity === "high" ? "text-[var(--danger)]" :
                    alert.severity === "medium" ? "text-[var(--warning)]" : "text-[var(--brand)]"
                  }`}>●</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{alert.title}</div>
                    <div className="text-xs text-[var(--text-dim)]">{alert.msg}</div>
                    <div className="text-[10px] text-[var(--text-dim)] mt-0.5">{alert.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Cost Chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Daily Cost · Last 30 days</h3>
            <span className="text-[10px] text-[var(--text-dim)] bg-[var(--bg-inset)] px-2 py-0.5 rounded">$45.2k total</span>
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
                <Tooltip
                  contentStyle={{ background: "#21262d", border: "1px solid #30363d", borderRadius: "6px", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="cost" stroke="#58a6ff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Invoice */}
      <div className="card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold">Recent Invoices</h3>
          <button className="btn text-[10px]">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Invoice", "Account", "Date", "Amount", "Status"].map((h) => (
                <th key={h} className="table-header text-left px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {[
              { inv: "INV-001", acc: "Main Production", date: "May 1, 2026", amount: "$45,232", status: "pending" },
              { inv: "INV-002", acc: "Dev & Staging", date: "May 1, 2026", amount: "$8,920", status: "paid" },
              { inv: "INV-003", acc: "Client Alpha", date: "May 1, 2026", amount: "$12,450", status: "paid" },
              { inv: "INV-004", acc: "ML Research", date: "May 1, 2026", amount: "$18,320", status: "paid" },
            ].map((row) => (
              <tr key={row.inv} className="hover:bg-[var(--bg-hover)] transition-colors">
                <td className="px-4 py-2 text-sm">{row.inv}</td>
                <td className="px-4 py-2 text-sm text-[var(--text-muted)]">{row.acc}</td>
                <td className="px-4 py-2 text-sm text-[var(--text-muted)]">{row.date}</td>
                <td className="px-4 py-2 text-sm font-medium">{row.amount}</td>
                <td className="px-4 py-2">
                  <span className={`badge ${row.status === "paid" ? "badge-success" : "badge-warning"}`}>
                    {row.status}
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
