import { Router } from 'express';
import { getDb } from './db.js';
import { authMiddleware, adminMiddleware } from './auth.js';
const router = Router();
// GET /api/gcp/projects — list GCP projects (from settings)
router.get('/projects', authMiddleware, (req, res) => {
    const db = getDb();
    const projects = db.prepare('SELECT * FROM settings WHERE key LIKE "gcp_project_%"').all();
    const parsed = projects.map((p) => {
        try {
            return JSON.parse(p.value);
        }
        catch {
            return { id: p.key.replace('gcp_project_', ''), name: p.value };
        }
    });
    res.json({ projects: parsed });
});
// GET /api/gcp/cost-data — return stored cost data
router.get('/cost-data', authMiddleware, (req, res) => {
    const db = getDb();
    const data = db.prepare("SELECT value FROM settings WHERE key = 'gcp_cost_data'").get();
    if (data) {
        try {
            return res.json(JSON.parse(data.value));
        }
        catch { }
    }
    // Return mock data as fallback
    res.json({
        monthlyCost: [
            { month: "Jan", cost: 48200, forecast: null },
            { month: "Feb", cost: 52100, forecast: null },
            { month: "Mar", cost: 61400, forecast: null },
            { month: "Apr", cost: 58900, forecast: null },
            { month: "May", cost: 74300, forecast: null },
            { month: "Jun", cost: 69800, forecast: null },
            { month: "Jul", cost: 82100, forecast: null },
            { month: "Aug", cost: 91200, forecast: null },
            { month: "Sep", cost: 88600, forecast: null },
            { month: "Oct", cost: 94100, forecast: null },
            { month: "Nov", cost: null, forecast: 98400 },
            { month: "Dec", cost: null, forecast: 103200 },
        ],
        services: [
            { name: "Compute Engine", cost: 38420, pct: 40.8, change: 12.4, color: "#4F8EF7" },
            { name: "Cloud Storage", cost: 18210, pct: 19.3, change: 3.1, color: "#34D399" },
            { name: "BigQuery", cost: 14890, pct: 15.8, change: 28.7, color: "#F59E0B" },
            { name: "Cloud SQL", cost: 9340, pct: 9.9, change: -2.3, color: "#A78BFA" },
            { name: "Kubernetes Engine", cost: 7120, pct: 7.6, change: 5.8, color: "#F87171" },
            { name: "Networking", cost: 4320, pct: 4.6, change: 1.2, color: "#38BDF8" },
            { name: "Other", cost: 1900, pct: 2.0, change: -0.8, color: "#6B7280" },
        ],
        projects: [
            { id: "proj-001", name: "prod-api-cluster", env: "Production", cost: 31240, budget: 35000, change: 8.2, status: "healthy" },
            { id: "proj-002", name: "ml-training-v3", env: "Production", cost: 28910, budget: 25000, change: 34.1, status: "over" },
            { id: "proj-003", name: "data-pipeline-eu", env: "Production", cost: 14320, budget: 20000, change: -3.4, status: "healthy" },
            { id: "proj-004", name: "staging-infra", env: "Staging", cost: 9840, budget: 12000, change: 2.1, status: "healthy" },
            { id: "proj-005", name: "analytics-bq", env: "Production", cost: 7620, budget: 8000, change: 22.8, status: "warning" },
            { id: "proj-006", name: "dev-sandbox", env: "Development", cost: 2270, budget: 5000, change: -12.0, status: "healthy" },
        ],
    });
});
// POST /api/gcp/cost-data — update stored cost data (admin)
router.post('/cost-data', authMiddleware, adminMiddleware, (req, res) => {
    const db = getDb();
    const data = JSON.stringify(req.body);
    db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('gcp_cost_data', ?, datetime('now'))")
        .run(data);
    db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
        .run(req.user.userId, 'Cost data updated', 'GCP cost data updated via API', 'write');
    res.json({ success: true });
});
// GET /api/gcp/budgets — return budget data
router.get('/budgets', authMiddleware, (req, res) => {
    const db = getDb();
    const data = db.prepare("SELECT value FROM settings WHERE key = 'gcp_budget_data'").get();
    if (data) {
        try {
            return res.json(JSON.parse(data.value));
        }
        catch { }
    }
    res.json({
        budgets: [
            { name: "Compute Engine", limit: 40000, spent: 38420, pct: 96.1, status: "critical" },
            { name: "ML Training", limit: 25000, spent: 28910, pct: 115.6, status: "exceeded" },
            { name: "Data Pipeline", limit: 20000, spent: 14320, pct: 71.6, status: "healthy" },
            { name: "Total Monthly", limit: 100000, spent: 94100, pct: 94.1, status: "warning" },
        ],
    });
});
// GET /api/gcp/audit-log
router.get('/audit-log', authMiddleware, (req, res) => {
    const db = getDb();
    const logs = db.prepare(`
    SELECT a.id, a.action, a.details, a.type, a.created_at as time, u.name as user
    FROM audit_log a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 50
  `).all();
    res.json({ logs });
});
export default router;
//# sourceMappingURL=gcpProxy.js.map