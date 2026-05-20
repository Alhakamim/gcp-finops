# CntxtLens — GCP FinOps Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](https://docker.com)

**CntxtLens** is a self-hosted GCP FinOps (Cloud Financial Operations) platform designed for marketplace deployment. It provides real-time cost intelligence, multi-account billing management, and AI-powered analytics in a single Docker container.

---

## 📦 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Alhakamim/gcp-finops.git
cd gcp-finops

# 2. Configure
cp .env.example .env
# Edit .env — change JWT_SECRET to a strong random string

# 3. Run
docker compose up -d

# 4. Open
open http://localhost:3001
```

### First-Time Setup
1. Register — **first user becomes admin**
2. Add billing accounts in **Settings → Billing Accounts**
3. Connect GCP billing data (API integration)
4. Invite team members

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         CntxtLens Container         │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Express Server (Node.js)    │  │
│  │                               │  │
│  │  /api/auth/*    → JWT Auth   │  │
│  │  /api/keys/*    → API Keys   │  │
│  │  /api/gcp/*     → GCP Proxy  │  │
│  │  /api/health    → Health     │  │
│  │                               │  │
│  │  /* (SPA)       → React App  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       SQLite Database         │  │
│  │  (users, keys, audit, data)   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Zero external dependencies** — no PostgreSQL, Redis, or S3 required.

---

## 🚀 Features

### 🔐 Authentication & Authorization
| Feature | Details |
|---------|---------|
| **JWT Auth** | Login/register with bcrypt-hashed passwords, 7-day tokens |
| **Role-Based Access** | `admin` (full access) / `viewer` (read-only) |
| **API Keys** | Create/revoke scoped API keys with `cl_` prefix |
| **Team Management** | Multi-user support with role badges |
| **Audit Log** | Full system activity tracking |

### 💰 Multi-Account Billing
| Feature | Details |
|---------|---------|
| **Multiple Accounts** | Unlimited GCP billing accounts per user |
| **Per-Account Data** | Each account has isolated cost data, budgets, projects |
| **Account Switcher** | Dropdown in sidebar to switch between accounts |
| **Default Account** | Mark one account as default for quick access |
| **Account CRUD** | Add/remove accounts from Settings |

### 📊 Dashboard Pages

#### Overview (`/`)
- **4 KPI Cards**: MTD Spend, Projected Month, Active Projects, Budget Utilization
- **Monthly Cost Trend**: Bar chart with actual vs forecast (12 months)
- **Service Breakdown**: Donut chart showing cost distribution across GCP services
- **Top Projects**: Project list with cost, budget, utilization, and status
- **Active Alerts**: System notifications and warnings

#### Cost Analytics (`/analytics`)
- **3 KPI Cards**: YTD Total, Avg Daily Cost, Cost Anomalies
- **Service Table**: Detailed breakdown with progress bars and sparklines
- **Regional Distribution**: Cost by GCP region with horizontal bars

#### Projects (`/projects`)
- **Project List**: Full table with environment badges, budget utilization bars
- **Real-time Data**: Fetches per active billing account

#### Invoices (`/invoices`)
- **Invoice KPIs**: Outstanding, Last Invoice, YTD Invoiced
- **Invoice History**: Table with download actions (mock data)

#### Budgets (`/budgets`)
- **Budget Cards**: Visual progress bars with color-coded status
- **Over-Budget Alerts**: Red warning when budget exceeded

#### Reports (`/reports`)
- **Report Types**: Cost Summary, Detailed Billing, Budget Report
- **Scheduled Reports**: Configurable delivery (PDF/CSV)

#### Settings (`/settings`)
- **Appearance**: Dark/Light mode toggle
- **Language**: English / Arabic (RTL support)
- **Billing Accounts**: Add/manage GCP billing accounts
- **API Keys**: Create/revoke API credentials
- **Team Members**: User list with roles
- **Audit Log**: System activity history

### 🌐 Internationalization
- **Languages**: English (en), Arabic (ar) with full RTL support
- **Fonts**: DM Sans (Latin) + Tajawal (Arabic)
- **Direction**: Auto LTR/RTL layout switching

### 🎨 Themes
- **Dark Mode**: Rich dark theme with gradient backgrounds
- **Light Mode**: Clean light theme
- **Smooth transitions** between themes
- **Custom scrollbar** styling

### 📅 Date Filter
- **Dynamic date range** selector in the header
- **Preset buttons**: 7D, 30D, 90D, 1Y
- **Custom range**: Manual from/to date inputs
- **Connected** to all dashboard data (re-fetches on change)

### ⌨️ Command Palette
- **Ctrl+K** / **Cmd+K** to open
- Search pages and actions
- Keyboard navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Backend** | Node.js 20, Express 4, TypeScript |
| **Database** | SQLite (sql.js — WebAssembly, zero native deps) |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **Container** | Docker, Multi-stage build |
| **Fonts** | DM Sans, DM Mono, Tajawal |

---

## 📁 Project Structure

```
cntxtlens/
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # One-command deployment
├── .env.example               # Configuration template
├── .gitignore
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite config + API proxy
├── tsconfig.json              # TypeScript config
├── index.html                 # SPA entry point
├── public/                    # Static assets
├── src/                       # Frontend React app
│   ├── main.tsx               # App entry (AuthProvider)
│   ├── AuthContext.tsx         # Auth state management
│   ├── LoginPage.tsx          # Login/Register UI
│   ├── CloudLens.tsx          # Main dashboard (all pages)
│   └── api.tsx                # API service layer
├── backend/                   # Backend server
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts           # Express server
│       ├── auth.ts            # JWT routes & middleware
│       ├── apiKeys.ts         # API key management
│       ├── gcpProxy.ts        # GCP data proxy (multi-account)
│       └── db.ts              # SQLite database layer
└── dist/                      # Built frontend
```

---

## 🔌 API Reference

### Authentication

```
POST /api/auth/register     → Register new user
POST /api/auth/login        → Login, returns JWT token
GET  /api/auth/me           → Current user info
GET  /api/auth/users        → List all users (admin)
```

### API Keys

```
GET    /api/keys            → List API keys
POST   /api/keys            → Create API key
DELETE /api/keys/:id        → Revoke API key
POST   /api/keys/validate   → Validate API key
```

### GCP Data

```
GET  /api/gcp/billing-accounts               → List billing accounts
POST /api/gcp/billing-accounts               → Add billing account
PUT  /api/gcp/billing-accounts/default/:id   → Set default account
DELETE /api/gcp/billing-accounts/:id         → Remove account

GET  /api/gcp/cost-data?account=&dateStart=&dateEnd=  → Cost data
GET  /api/gcp/budgets?account=&dateStart=&dateEnd=     → Budget data
GET  /api/gcp/projects?account=&dateStart=&dateEnd=    → Projects
GET  /api/gcp/audit-log                                → Audit log
POST /api/gcp/cost-data                                → Update cost data
```

### System

```
GET  /api/health  → Health check
```

---

## 🔧 Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | (required) | Secret key for JWT signing |
| `PORT` | `3001` | Server port |
| `DB_PATH` | `./backend/data/cloudlens.db` | SQLite database path |
| `FRONTEND_DIR` | `../dist` | Built frontend directory |
| `CORS_ORIGIN` | `*` | CORS allowed origins |

---

## 🐳 Docker

```bash
# Build
docker compose build

# Start
docker compose up -d

# Logs
docker compose logs -f

# Stop
docker compose down

# Reset data
docker compose down -v
```

### Health Check
The container includes a health check at `/api/health`.

---

## 🔒 Security

- **Passwords**: bcrypt hashed (12 rounds)
- **JWT**: 7-day expiry, configurable
- **API Keys**: 64-char random hex, stored hashed
- **SQLite**: WAL mode for concurrent access
- **No external calls**: Fully air-gapped by default
- **HTTPS**: Recommended via reverse proxy (nginx/Caddy)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🌟 Support

- **Issues**: [GitHub Issues](https://github.com/Alhakamim/gcp-finops/issues)
- **Email**: alhakamim00@gmail.com
