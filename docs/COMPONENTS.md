# CntxtLens — Dashboard Components

## 📊 Overview Page (`/`)

### KPI Cards
| Component | Data Source | Description |
|-----------|-------------|-------------|
| **MTD Spend** | `gcpApi.costData()` | Month-to-date cloud spend |
| **Projected Month** | `gcpApi.costData()` | End-of-month forecast |
| **Active Projects** | `gcpApi.projects()` | Count of active GCP projects |
| **Budget Utilization** | `gcpApi.budgets()` | % of total budget consumed |

### Charts
| Component | Type | Data |
|-----------|------|------|
| **Monthly Cost Trend** | Bar chart (SVG) | 12 months actual vs forecast |
| **Service Breakdown** | Donut chart (SVG) | Cost by GCP service (top 5) |
| **Top Projects** | Table | Project cost, budget, status |
| **Active Alerts** | List | Warnings & notifications |

## 📈 Cost Analytics Page (`/analytics`)

### KPI Cards
| Component | Description |
|-----------|-------------|
| **YTD Total** | Year-to-date cumulative spend |
| **Avg Daily Cost** | 30-day rolling average |
| **Cost Anomalies** | Count of detected anomalies |

### Tables & Charts
| Component | Details |
|-----------|---------|
| **Service Breakdown** | Full table with progress bars, sparklines |
| **Regional Distribution** | Cost by GCP region |

## 📋 Projects Page (`/projects`)
- Full project table with environment badges (Prod/Staging/Dev)
- Budget utilization bars (color-coded)
- Status badges (Healthy/Warning/Over/Critical)

## 💳 Invoices Page (`/invoices`)
- Invoice KPI cards
- Invoice history table
- Download action buttons

## 💰 Budgets Page (`/budgets`)
- Visual budget cards with animated progress bars
- Color-coded status (green/yellow/red)
- Over-budget alerts with amounts

## 📄 Reports Page (`/reports`)
- Report type cards (Cost Summary, Detailed Billing, Budget Report)
- Scheduled reports with frequency and format

## ⚙️ Settings Page (`/settings`)

### Sections
| Section | Functionality |
|---------|---------------|
| **Appearance** | Dark/Light mode toggle |
| **Language** | English/Arabic with RTL |
| **Billing Accounts** | CRUD for GCP billing accounts |
| **API Keys** | Create/revoke with live key display |
| **Team** | User listing with roles |
| **Audit Log** | Activity history |

## Shared Components

### UI Components
- `Card` — Wrapper with theme-aware styling
- `KPICard` — Metric display with sparklines
- `Badge` — Status indicators (healthy/warning/over/critical)
- `Change` — Up/down percentage indicator
- `EnvBadge` — Environment tag (Prod/Staging/Dev)
- `AlertDot` — Notification severity dot
- `SectionHeader` — Section title with optional action button
- `SegmentControl` — Button group toggle
- `SegmentControl` — Theme/language switcher

### Charts
- `BarChart` — SVG bar chart with gradients and forecasts
- `DonutChart` — SVG donut chart with arc segments
- `SparkLine` — Mini SVG line chart for trends

### Navigation
- `Sidebar` — Account switcher + navigation + theme/language
- `Header` — Page title + date picker + notifications + user menu
- `CommandPalette` — Ctrl+K search overlay

## Data Flow

```
User Interaction
      ↓
Billing Account Change → activeAccount?.id updates
Date Range Change → dateStart/dateEnd updates
      ↓
useEffect fires [activeAccount?.id, dateStart, dateEnd]
      ↓
gcpApi.costData(id, dateStart, dateEnd) → API call
      ↓
Server returns per-account data from SQLite
      ↓
Component state updates → Re-render
```

## State Management
The app uses React Context (`AppCtx`) with:
- `dark` / `setDark` — Theme state
- `lang` / `setLang` — Language state
- `t` / `T` — Translation / Theme objects
- `activeAccount` — Current billing account
- `dateStart` / `dateEnd` — Date range filter
