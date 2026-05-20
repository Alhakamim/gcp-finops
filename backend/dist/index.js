import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './auth.js';
import apiKeysRouter from './apiKeys.js';
import gcpRouter from './gcpProxy.js';
import { initDb } from './db.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_DIR = process.env.FRONTEND_DIR || path.join(__dirname, '..', '..', 'dist');
const app = express();
// ─── Middleware ───────────────────────────────────────────
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/keys', apiKeysRouter);
app.use('/api/gcp', gcpRouter);
// ─── Health check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// ─── Serve frontend (React SPA) ──────────────────────────
app.use(express.static(FRONTEND_DIR));
app.get('*', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});
// ─── Start ────────────────────────────────────────────────
async function start() {
    try {
        await initDb();
        console.log('✓ Database initialized');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✓ CloudLens server running on port ${PORT}`);
            console.log(`✓ Frontend: ${FRONTEND_DIR}`);
        });
    }
    catch (err) {
        console.error('Failed to start:', err);
        process.exit(1);
    }
}
start();
export default app;
//# sourceMappingURL=index.js.map