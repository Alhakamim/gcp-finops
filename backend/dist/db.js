import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'cloudlens.db');
let isInitialized = false;
let SQL;
let database;
function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function save() {
    try {
        ensureDir(DB_PATH);
        const data = database.export();
        fs.writeFileSync(DB_PATH, Buffer.from(data));
    }
    catch (err) {
        console.error('Failed to save database:', err);
    }
}
// ─── Sync wrapper ────────────────────────────────────
class SyncDb {
    run(sql, params = []) {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        save();
        return database.getRowsModified();
    }
    get(sql, params = []) {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        let row = undefined;
        if (stmt.step()) {
            row = stmt.getAsObject();
        }
        stmt.free();
        return row;
    }
    all(sql, params = []) {
        const stmt = database.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
            rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
    }
    prepare(sql) {
        const stmt = database.prepare(sql);
        const self = this;
        return {
            run: (...params) => {
                stmt.bind(params);
                stmt.step();
                stmt.free();
                save();
                return { changes: database.getRowsModified() };
            },
            get: (...params) => {
                try {
                    stmt.bind(params);
                    if (stmt.step()) {
                        const row = stmt.getAsObject();
                        stmt.free();
                        return row;
                    }
                    stmt.free();
                    return undefined;
                }
                catch (e) {
                    stmt.free();
                    throw e;
                }
            },
            all: (...params) => {
                stmt.bind(params);
                const rows = [];
                while (stmt.step()) {
                    rows.push(stmt.getAsObject());
                }
                stmt.free();
                return rows;
            },
        };
    }
    exec(sql) {
        database.exec(sql);
        save();
    }
    close() {
        save();
        database.close();
    }
}
function createDb() {
    if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH);
        database = new SQL.Database(data);
    }
    else {
        database = new SQL.Database();
    }
    return new SyncDb();
}
function initSchema(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'viewer',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      key TEXT UNIQUE NOT NULL,
      last_used TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      type TEXT DEFAULT 'info',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
let db;
export async function initDb() {
    if (!isInitialized) {
        SQL = await initSqlJs();
        db = createDb();
        initSchema(db);
        isInitialized = true;
    }
    return db;
}
export function getDb() {
    if (!db)
        throw new Error('DB not initialized. Call initDb() first.');
    return db;
}
export function closeDb() {
    if (db) {
        db.close();
        isInitialized = false;
    }
}
//# sourceMappingURL=db.js.map