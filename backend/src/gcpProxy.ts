import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { getDb } from './db.js';
import { authMiddleware } from './auth.js';

const router = Router();

// ─── Billing Account Management ─────────────────────────

// GET /api/gcp/billing-accounts — list user's billing accounts
router.get('/billing-accounts', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const db = getDb();
  const accs = db.prepare(
    'SELECT id, name, account_id, provider, description, is_default, is_active, created_at FROM billing_accounts WHERE user_id = ? ORDER BY is_default DESC, created_at ASC'
  ).all(userId);

  // If no accounts, create a default one
  if (accs.length === 0) {
    const id = uuid();
    db.prepare(
      "INSERT INTO billing_accounts (id, user_id, name, account_id, provider, description, is_default) VALUES (?, ?, ?, ?, 'gcp', 'Default GCP Billing Account', 1)"
    ).run(id, userId, 'My GCP Account', 'default');
    accs.push({
      id, name: 'My GCP Account', account_id: 'default',
      provider: 'gcp', description: 'Default GCP Billing Account',
      is_default: 1, is_active: 1, created_at: new Date().toISOString(),
    });
  }

  res.json({ accounts: accs });
});

// POST /api/gcp/billing-accounts — add billing account
router.post('/billing-accounts', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const { name, account_id, provider, description } = req.body;
  if (!name || !account_id) {
    return res.status(400).json({ error: 'Name and account ID required' });
  }

  const db = getDb();
  const id = uuid();

  // First account becomes default
  const count = (db.prepare('SELECT COUNT(*) as count FROM billing_accounts WHERE user_id = ?').get(userId) as any).count;
  const isDefault = count === 0 ? 1 : 0;

  db.prepare(
    'INSERT INTO billing_accounts (id, user_id, name, account_id, provider, description, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, name, account_id, provider || 'gcp', description || '', isDefault);

  db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
    .run(userId, 'Billing account added', `Account "${name}" (${account_id}) added`, 'write');

  res.status(201).json({
    id, name, account_id, provider: provider || 'gcp',
    description: description || '', is_default: isDefault, is_active: 1,
  });
});

// PUT /api/gcp/billing-accounts/default/:id — set default account
router.put('/billing-accounts/default/:id', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const db = getDb();

  const acc = db.prepare('SELECT id FROM billing_accounts WHERE id = ? AND user_id = ?')
    .get(req.params.id, userId);
  if (!acc) return res.status(404).json({ error: 'Billing account not found' });

  db.prepare('UPDATE billing_accounts SET is_default = 0 WHERE user_id = ?').run(userId);
  db.prepare('UPDATE billing_accounts SET is_default = 1 WHERE id = ?').run(req.params.id);

  db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
    .run(userId, 'Default account changed', `Default billing account set to ${req.params.id}`, 'write');

  res.json({ success: true });
});

// DELETE /api/gcp/billing-accounts/:id
router.delete('/billing-accounts/:id', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const db = getDb();

  const acc = db.prepare('SELECT id, is_default FROM billing_accounts WHERE id = ? AND user_id = ?')
    .get(req.params.id, userId) as any;
  if (!acc) return res.status(404).json({ error: 'Billing account not found' });

  db.prepare('DELETE FROM billing_accounts WHERE id = ? AND user_id = ?').run(req.params.id, userId);

  // If it was default, make another one default
  if (acc.is_default) {
    const next = db.prepare('SELECT id FROM billing_accounts WHERE user_id = ? LIMIT 1').get(userId) as any;
    if (next) {
      db.prepare('UPDATE billing_accounts SET is_default = 1 WHERE id = ?').run(next.id);
    }
  }

  // Clean up stored data for this account
  db.prepare("DELETE FROM settings WHERE key = ?").run(`gcp_cost_data_${req.params.id}`);
  db.prepare("DELETE FROM settings WHERE key = ?").run(`gcp_budget_data_${req.params.id}`);

  db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
    .run(userId, 'Billing account removed', `Billing account ${acc.id} removed`, 'write');

  res.json({ success: true });
});

// ─── Data per Billing Account ───────────────────────────

function getDefaultAccountId(userId: string): string {
  const db = getDb();
  const acc = db.prepare('SELECT id FROM billing_accounts WHERE user_id = ? AND is_default = 1').get(userId) as any;
  return acc?.id || 'default';
}

// GET /api/gcp/projects — list projects (per account)
router.get('/projects', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const accountId = (req.query.account as string) || getDefaultAccountId(userId);

  const db = getDb();
  const raw = db.prepare("SELECT value FROM settings WHERE key = ?").get(`gcp_projects_${accountId}`) as any;
  if (raw) {
    try { return res.json(JSON.parse(raw.value)); } catch {}
  }
  // Mock data
  res.json({
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

// GET /api/gcp/cost-data — per billing account
router.get('/cost-data', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const accountId = (req.query.account as string) || getDefaultAccountId(userId);
  const db = getDb();

  const raw = db.prepare("SELECT value FROM settings WHERE key = ?").get(`gcp_cost_data_${accountId}`) as any;
  if (raw) {
    try { return res.json(JSON.parse(raw.value)); } catch {}
  }

  // Mock data with account-specific names
  res.json({
    monthlyCost: [
      { month: "Jan", cost: 48200, forecast: null }, { month: "Feb", cost: 52100, forecast: null },
      { month: "Mar", cost: 61400, forecast: null }, { month: "Apr", cost: 58900, forecast: null },
      { month: "May", cost: 74300, forecast: null }, { month: "Jun", cost: 69800, forecast: null },
      { month: "Jul", cost: 82100, forecast: null }, { month: "Aug", cost: 91200, forecast: null },
      { month: "Sep", cost: 88600, forecast: null }, { month: "Oct", cost: 94100, forecast: null },
      { month: "Nov", cost: null, forecast: 98400 }, { month: "Dec", cost: null, forecast: 103200 },
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
  });
});

// POST /api/gcp/cost-data — update cost data per account (admin)
router.post('/cost-data', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const accountId = (req.body.account as string) || getDefaultAccountId(userId);
  const db = getDb();
  const data = JSON.stringify(req.body.data || req.body);
  db.prepare(
    "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))"
  ).run(`gcp_cost_data_${accountId}`, data);
  db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
    .run(userId, 'Cost data updated', `Cost data for account ${accountId}`, 'write');
  res.json({ success: true });
});

// GET /api/gcp/budgets — per account
router.get('/budgets', authMiddleware, (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const accountId = (req.query.account as string) || getDefaultAccountId(userId);
  const db = getDb();

  const raw = db.prepare("SELECT value FROM settings WHERE key = ?").get(`gcp_budget_data_${accountId}`) as any;
  if (raw) {
    try { return res.json(JSON.parse(raw.value)); } catch {}
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
router.get('/audit-log', authMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const logs = db.prepare(`
    SELECT a.id, a.action, a.details, a.type, a.created_at as time, u.name as user
    FROM audit_log a LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC LIMIT 50
  `).all();
  res.json({ logs });
});

export default router;
