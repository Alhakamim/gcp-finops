# GCP FinOps — Enterprise Billing Analytics Platform

> A modern, enterprise-grade Google Cloud Billing & FinOps SaaS platform built with NestJS, Next.js, and PostgreSQL.

![Stack](https://img.shields.io/badge/NestJS-v10-red?logo=nestjs)
![Stack](https://img.shields.io/badge/Next.js-v15-black?logo=next.js)
![Stack](https://img.shields.io/badge/PostgreSQL-v16-blue?logo=postgresql)
![Stack](https://img.shields.io/badge/Prisma-v5-green?logo=prisma)
![Stack](https://img.shields.io/badge/TypeScript-v5-blue?logo=typescript)

---

## ✨ Features

### 💰 Cost Management
- **Multi-Account Billing** — Manage multiple GCP billing accounts from one dashboard
- **Real-time Cost Tracking** — Daily cost breakdowns by service, project, and region
- **Budget Management** — Set budgets with automatic threshold alerts at 50%, 75%, 90%, 100%
- **Cost Forecasting** — ML-based linear regression forecasting with confidence scoring

### 📊 Analytics
- **Service Breakdown** — Detailed SKU-level cost analysis
- **Month-over-Month Trends** — Compare costs across billing periods
- **Cost Anomaly Detection** — Automatic detection of cost spikes and anomalies
- **Export & Reports** — CSV/PDF export with scheduled report delivery

### 🏢 Multi-Tenant
- **Organization Management** — Multi-tenant architecture with isolated data
- **Role-Based Access** — Admin, Manager, Member, Viewer roles
- **Customer Management** — Manage client billing accounts under your organization

### 🔐 Security
- **JWT Authentication** — Secure token-based auth
- **OAuth Ready** — Google OAuth integration
- **API Keys** — Programmatic access with scoped API keys
- **Audit Logging** — Complete audit trail of all actions
- **Rate Limiting** — ThrottleGuard protection

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 22+

### One-Command Setup

```bash
# Clone & start
git clone https://github.com/your-org/gcp-finops.git
cd gcp-finops
cp .env.example .env
docker compose up -d

# Run database migrations
docker compose exec backend npx prisma migrate dev --name init

# Seed sample data
docker compose exec backend npx prisma db seed

# Access the dashboard
open http://localhost:3000
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | Admin123! |
| Viewer | viewer@acme.com | Viewer123! |

---

## 🏗 Architecture

```
gcp-finops/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── main.ts          # Entry point
│   │   ├── app.module.ts    # Root module
│   │   ├── common/          # Shared (guards, decorators, prisma)
│   │   └── modules/
│   │       ├── auth/        # Authentication & authorization
│   │       ├── billing/     # Billing accounts & cost data
│   │       ├── analytics/   # Cost analytics & forecasting
│   │       ├── budgets/     # Budget management & alerts
│   │       ├── invoices/    # Invoice management
│   │       ├── reports/     # Report generation & scheduling
│   │       ├── customers/   # Customer management (multi-tenant)
│   │       └── admin/       # Admin settings & audit logs
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── seed.ts          # Seed data
├── frontend/                 # Next.js SPA
│   └── src/
│       ├── app/             # Pages (dashboard, billing, analytics, etc.)
│       ├── components/      # UI components
│       └── lib/             # Utilities
└── docker-compose.yml       # Infrastructure
```

### Data Flow

```
Browser → Next.js → NestJS API → Prisma → PostgreSQL
                ↓
         GCP Billing API / BigQuery (when configured)
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new organization |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/profile` | Get profile |
| GET | `/api/v1/billing/accounts` | List billing accounts |
| GET | `/api/v1/billing/accounts/:id` | Account details |
| GET | `/api/v1/billing/accounts/:id/summary` | Account summary |
| GET | `/api/v1/billing/accounts/:id/costs` | Cost data (filterable) |
| GET | `/api/v1/billing/accounts/:id/services` | Service breakdown |
| GET | `/api/v1/billing/accounts/:id/anomalies` | Cost anomalies |
| GET | `/api/v1/billing/accounts/:id/forecast` | Cost forecast |
| GET | `/api/v1/billing/accounts/:id/trend` | Daily trend |
| GET | `/api/v1/analytics/overview` | Analytics overview |
| GET | `/api/v1/analytics/cost-trend` | Cost trend data |
| GET | `/api/v1/analytics/top-services` | Top services |
| GET | `/api/v1/admin/users` | User management |

📘 **Full Swagger docs:** `http://localhost:4000/api/v1/docs`

---

## 🐳 Deployment

### Docker Compose (Production)

```bash
docker compose up -d --build
```

### Google Cloud Run

```bash
# Build and push
docker build -t gcr.io/your-project/gcp-finops-api ./backend
docker build -t gcr.io/your-project/gcp-finops-web ./frontend

# Push
docker push gcr.io/your-project/gcp-finops-api
docker push gcr.io/your-project/gcp-finops-web

# Deploy
gcloud run deploy gcp-finops-api \
  --image gcr.io/your-project/gcp-finops-api \
  --add-cloudsql-instances your-instance \
  --set-env-vars "DATABASE_URL=..."
```

### Environment Variables

See `.env.example` for all configuration options.

---

## 🔗 GCP Integration

To connect real GCP billing data:

1. **Create a Service Account** in GCP IAM with:
   - `Billing Account Viewer`
   - `Billing Account Cost Management`
   - `BigQuery Job User` (for BigQuery export)

2. **Enable Billing Export** in GCP Console:
   - BigQuery → Billing Export → Set up daily cost export

3. **Configure the platform:**
   ```env
   GCP_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   GCP_PROJECT_ID=your-project
   GCP_BILLING_EXPORT_DATASET=billing_export
   GCP_BILLING_EXPORT_TABLE=gcp_billing_export_v1_XXX
   ```

4. **Run sync:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/billing/sync \
     -H "Authorization: Bearer <token>"
   ```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# E2E
npm run test:e2e
```

---

## 📄 License

MIT © Acme Corp
