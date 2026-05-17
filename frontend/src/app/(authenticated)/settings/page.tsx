"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-base font-semibold">Settings</h1>
        <p className="text-sm text-[var(--text-dim)]">Admin & configuration</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 card-hover">
          <h3 className="text-sm font-semibold mb-3">Users</h3>
          <div className="space-y-2">
            {[
              { name: "Admin User", email: "admin@acme.com", role: "Admin" },
              { name: "Viewer User", email: "viewer@acme.com", role: "Viewer" },
            ].map((u) => (
              <div key={u.email} className="flex items-center gap-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-[var(--bg-inset)] flex items-center justify-center text-xs font-medium">
                  {u.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{u.name}</div>
                  <div className="text-xs text-[var(--text-dim)]">{u.email}</div>
                </div>
                <span className={`badge ${u.role === "Admin" ? "badge-info" : "badge-success"}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 card-hover">
          <h3 className="text-sm font-semibold mb-3">API Keys</h3>
          <div className="text-sm text-[var(--text-dim)] text-center py-6">
            No API keys yet. Create one to access the API programmatically.
          </div>
        </div>

        <div className="card p-4 card-hover">
          <h3 className="text-sm font-semibold mb-3">GCP Integration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Service Account</span>
              <span className="badge-success">Not configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">BigQuery Export</span>
              <span className="badge-warning">Pending setup</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)]">Last Sync</span>
              <span className="text-xs text-[var(--text-dim)]">Never</span>
            </div>
          </div>
        </div>

        <div className="card p-4 card-hover">
          <h3 className="text-sm font-semibold mb-3">Audit Log</h3>
          <div className="text-sm text-[var(--text-dim)]">
            <div className="py-1 border-b border-[var(--border)] flex justify-between">
              <span>System seeded with sample data</span>
              <span className="text-[10px]">Today</span>
            </div>
            <div className="py-1 border-b border-[var(--border)] flex justify-between">
              <span>User admin@acme.com logged in</span>
              <span className="text-[10px]">Today</span>
            </div>
            <div className="py-1 flex justify-between">
              <span>Dashboard initialized</span>
              <span className="text-[10px]">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
