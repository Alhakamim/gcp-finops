import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { getDb } from './db.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cloudlens-dev-secret-change-in-production';
const JWT_EXPIRES = parseInt(process.env.JWT_EXPIRES || '604800', 10); // 7 days in seconds
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
// ─── Auth Middleware ─────────────────────────────────────
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
export function adminMiddleware(req, res, next) {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}
// ─── Routes ─────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Email, name, and password required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        const db = getDb();
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const id = uuid();
        // First user is admin
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const role = userCount === 0 ? 'admin' : 'viewer';
        db.prepare('INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)')
            .run(id, email, name, hashedPassword, role);
        db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
            .run(id, 'User registered', `User ${name} (${email}) registered`, 'system');
        const token = generateToken({ userId: id, email, role });
        res.status(201).json({
            token,
            user: { id, email, name, role }
        });
    }
    catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        db.prepare('UPDATE users SET updated_at = datetime(\'now\') WHERE id = ?').run(user.id);
        db.prepare('INSERT INTO audit_log (user_id, action, details, type) VALUES (?, ?, ?, ?)')
            .run(user.id, 'User logged in', `Login from ${email}`, 'info');
        const token = generateToken({ userId: user.id, email: user.email, role: user.role });
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
    const { userId } = req.user;
    const db = getDb();
    const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    res.json({ user });
});
// GET /api/auth/users (admin only)
router.get('/users', authMiddleware, adminMiddleware, (req, res) => {
    const db = getDb();
    const users = db.prepare('SELECT id, email, name, role, created_at, updated_at FROM users ORDER BY created_at DESC').all();
    res.json({ users });
});
export default router;
//# sourceMappingURL=auth.js.map