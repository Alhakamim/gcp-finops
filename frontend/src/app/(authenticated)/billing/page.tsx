"use client";

export default function BillingPage() {
  const accounts = [
    { name: "Main Production", id: "Billing-001", budget: 80000, spent: 45232, projects: 3, status: "active" },
    { name: "Dev & Staging", id: "Billing-002", budget: 15000, spent: 8920, projects: 2, status: "active" },
    { name: "Client Alpha", id: "Billing-003", budget: 25000, spent: 12450, projects: 2, status: "active" },
    { name: "ML Research", id: "Billing-004", budget: 30000, spent: 18320, projects: 2, status: "active" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-base font-semibold">Billing Accounts</h1>
        <p className="text-sm text-[var(--text-dim)]">Manage your GCP billing accounts</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {accounts.map((a) => {
          const pct = (a.spent / a.budget) * 100;
          return (
            <div key={a.id} className="card p-4 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-xs text-[var(--text-dim)]">{a.id}</div>
                </div>
                <span className={`badge ${a.status === "active" ? "badge-success" : "badge-warning"}`}>
                  {a.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-[var(--text-dim)]">Budget</div>
                  <div className="text-sm font-semibold">${a.budget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-dim)]">Spent</div>
                  <div className="text-sm font-semibold">${a.spent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-dim)]">Projects</div>
                  <div className="text-sm font-semibold">{a.projects}</div>
                </div>
              </div>
              <div className="h-1 bg-[var(--bg-inset)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: pct > 90 ? "var(--danger)" : pct > 75 ? "var(--warning)" : "var(--brand)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
