"use client";

export default function AlertsPage() {
  const alerts = [
    { severity: "high", title: "Threshold Reached: 90% Budget", msg: "Main Production billing account has consumed 90% of its $80,000 monthly budget.", time: "2 hours ago", account: "Main Production" },
    { severity: "high", title: "Cost Anomaly: Compute Spike", msg: "Compute Engine costs increased 86.7% above expected baseline in us-central1.", time: "6 hours ago", account: "ML Research" },
    { severity: "medium", title: "Storage Growth Warning", msg: "Cloud Storage usage growing 23% week-over-week in prod buckets.", time: "1 day ago", account: "Main Production" },
    { severity: "low", title: "Savings Opportunity", msg: "Reserved instances could save approximately $1,200/month on steady-state workloads.", time: "2 days ago", account: "All Accounts" },
    { severity: "low", title: "New SKU Available", msg: "New C3D machine family available in us-central1 with 15% better price-performance.", time: "3 days ago", account: "All Accounts" },
  ];

  const severityIcon: Record<string, string> = { high: "🔴", medium: "🟡", low: "🔵" };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Alerts</h1>
          <p className="text-sm text-[var(--text-dim)]">Budget warnings & anomalies</p>
        </div>
        <span className="badge-danger text-[10px]">5 active</span>
      </div>

      <div className="space-y-1">
        {alerts.map((a) => (
          <div key={a.title} className="card p-3 card-hover">
            <div className="flex items-start gap-3">
              <span className="text-sm mt-0.5">{severityIcon[a.severity] || "🔵"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-[var(--text-dim)] mt-0.5">{a.msg}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-[var(--text-dim)]">{a.time}</span>
                  <span className="text-[10px] text-[var(--text-dim)]">·</span>
                  <span className="text-[10px] text-[var(--text-dim)]">{a.account}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
