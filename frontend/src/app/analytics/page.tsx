"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-base font-semibold">Analytics</h1>
        <p className="text-sm text-[var(--text-dim)]">Cost analytics & forecasting</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Cost", value: "$45,232", sub: "+5.2% vs last month" },
          { label: "Forecast", value: "$67,250", sub: "End of month projection" },
          { label: "Daily Avg", value: "$1,507", sub: "Over last 30 days" },
          { label: "Anomalies", value: "3", sub: "2 high · 1 medium" },
        ].map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card p-6 text-center text-[var(--text-dim)]">
        <div className="text-lg mb-2">📊</div>
        <p>Advanced analytics dashboard with cost trends, forecasting models,<br />and anomaly detection coming soon.</p>
      </div>
    </div>
  );
}
