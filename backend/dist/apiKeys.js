import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { getDb } from './db.js';
import { authMiddleware } from './auth.js';
const router = Router();
function generateApiKey() {
    return 'cl_' + crypto.randomBytes(32).toString('hex');
}
// GET /api/keys — list user's API keys
router.get('/', authMiddleware, (req, res) => {
    const { userId } = req.user;
    const db = getDb();
    const keys = db.prepare('SELECT id, name, last_used, status, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json({ keys });
});
// POST /api/keys — create new API key
router.post('/', authMiddleware, (req, res) => {
    const { userId } = req.user;
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ error: 'Key name required' });
    const db = getDb();
    const id = uuid();
    const key = generateApiKey();
    db.prepare('INSERT INTO api_keys (id, user_id, name, key) VALUES (?, ?, ?, ?)')
        .run(id, userId, name, key);
    db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
        .run(userId, 'API key created', `Key "${name}" created`, 'write');
    res.status(201).json({ id, name, key, status: 'active' });
});
// DELETE /api/keys/:id — revoke API key
router.delete('/:id', authMiddleware, (req, res) => {
    const { userId } = req.user;
    const db = getDb();
    const key = db.prepare('SELECT id FROM api_keys WHERE id = ? AND user_id = ?')
        .get(req.params.id, userId);
    if (!key)
        return res.status(404).json({ error: 'API key not found' });
    db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?')
        .run(req.params.id, userId);
    db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
        .run(userId, 'API key deleted', `Key deleted`, 'write');
    res.json({ success: true });
});
// POST /api/keys/validate — validate API key (used by GCP proxy)
router.post('/validate', (req, res) => {
    const { key } = req.body;
    if (!key)
        return res.status(400).json({ error: 'API key required' });
    const db = getDb();
    const record = db.prepare('SELECT id, user_id, status FROM api_keys WHERE key = ?')
        .get(key);
    if (!record || record.status !== 'active') {
        return res.status(401).json({ valid: false });
    }
    db.prepare('UPDATE api_keys SET last_used = datetime(\'now\') WHERE id = ?')
        .run(record.id);
    res.json({ valid: true, userId: record.user_id });
});
export default router;
//# sourceMappingURL=apiKeys.js.map