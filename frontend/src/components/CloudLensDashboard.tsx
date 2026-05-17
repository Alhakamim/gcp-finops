// @ts-nocheck
import { useState, useEffect, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════
// ─── i18n TRANSLATIONS
// ═══════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    dir: "ltr",
    appName: "CloudLens",
    appSub: "FinOps Platform",
    billingAccount: "Billing Account",
    liveSyncAgo: "Live Sync · 2m ago",
    search: "Search…",
    nav: { overview:"Overview", analytics:"Cost Analytics", projects:"Projects", invoices:"Invoices", budgets:"Budgets", reports:"Reports", settings:"Settings" },
    dateRange: "Oct 1 – Oct 31, 2024",
    vsLastMonth: "vs last month",
    thisMonth: "This Month",
    kpi: {
      mtd:"MTD Spend", mtdSub:"Oct 2024",
      projected:"Projected Month", projectedSub:"Forecast",
      activeProjects:"Active Projects", activeProjectsSub:"Across 3 envs",
      budgetUtil:"Budget Utilization", budgetUtilSub:"$100K limit",
      ytd:"YTD Total", ytdSub:"Jan–Oct 2024",
      avgDaily:"Avg Daily Cost", avgDailySub:"30-day rolling",
      anomalies:"Cost Anomalies", anomaliesSub:"Last 30 days",
      outstanding:"Outstanding", outstandingSub:"All invoices paid",
      lastInvoice:"Last Invoice", lastInvoiceSub:"Oct 2024",
      ytdInvoiced:"YTD Invoiced", ytdInvoicedSub:"10 invoices",
    },
    charts: {
      monthlyCostTrend:"Monthly Cost Trend", monthlyCostSub:"Actual vs Forecast · 2024",
      serviceBreakdown:"Service Breakdown", serviceBreakdownSub:"By cost, this month",
      actual:"Actual", forecast:"Forecast",
    },
    tables: {
      topProjects:"Top Projects by Spend", topProjectsSub:"This billing period",
      viewAll:"View All", export:"Export", exportCsv:"Export CSV",
      activeAlerts:"Active Alerts",
      project:"Project", environment:"Environment", mtdCost:"MTD Cost",
      budget:"Budget", utilization:"Utilization", status:"Status",
      service:"Service", cost:"Cost", pctOfTotal:"% of Total",
      vsLastMonth:"vs Last Month", trend:"Trend",
      regional:"Regional Distribution", regionalSub:"Cost by GCP region",
    },
    badge: { healthy:"Healthy", warning:"Warning", over:"Over Budget", critical:"Critical", exceeded:"Exceeded", paid:"Paid", pending:"Pending", active:"Active" },
    env: { Production:"Production", Staging:"Staging", Development:"Development" },
    alerts: [
      { type:"critical", msg:"ml-training-v3 exceeded budget by 15.6%", time:"2h ago" },
      { type:"warning",  msg:"Compute Engine at 96% of monthly budget", time:"4h ago" },
      { type:"warning",  msg:"BigQuery costs up 28.7% vs last month",   time:"6h ago" },
      { type:"info",     msg:"Monthly report ready for October 2024",    time:"1d ago" },
    ],
    invoices: {
      history:"Invoice History", historySub:"All billing periods",
      downloadAll:"Download All",
      invoiceId:"Invoice ID", period:"Billing Period",
      amount:"Amount", status:"Status", action:"Action", download:"↓ PDF",
    },
    budgets: { overBy:"⚠ Over budget by" },
    reports: {
      generate:"Generate Report", generateSub:"Export billing data in various formats",
      scheduled:"Scheduled Reports", scheduledSub:"Automated delivery configuration",
      newSchedule:"+ New Schedule", edit:"Edit",
      types:[
        { title:"Cost Summary",      desc:"Monthly cost breakdown by service and project" },
        { title:"Detailed Billing",  desc:"SKU-level billing export with all line items" },
        { title:"Budget Report",     desc:"Budget utilization and forecast analysis" },
      ],
      schedules:[
        { name:"Monthly Executive Summary", freq:"1st of month",        recipients:"team@company.com",    format:"PDF" },
        { name:"Weekly Cost Digest",        freq:"Every Monday",        recipients:"devops@company.com",  format:"CSV" },
        { name:"Budget Alert Report",       freq:"When threshold hit",  recipients:"finance@company.com", format:"PDF" },
      ],
    },
    settings: {
      apiKeys:"API Keys", apiKeysSub:"Manage service account credentials", newKey:"+ New Key",
      team:"Team Members", teamSub:"3 members", invite:"Invite",
      audit:"Audit Log", auditSub:"Recent system activity",
      created:"Created", lastUsed:"Last used",
      appearanceTitle:"Appearance & Language",
      keys:[
        { name:"Production Service Account", created:"Jan 15, 2024", last:"2 hours ago", status:"active" },
        { name:"BigQuery Read-Only",          created:"Mar 3, 2024",  last:"5 days ago",  status:"active" },
      ],
      members:[
        { name:"Mohammed Al-Rashid", role:"Owner",  email:"m@company.com" },
        { name:"Sarah Chen",         role:"Admin",  email:"s@company.com" },
        { name:"James Wilson",       role:"Viewer", email:"j@company.com" },
      ],
      logs:[
        { action:"Budget threshold updated",          user:"Mohammed Al-Rashid", time:"Today, 14:23",   type:"write"  },
        { action:"Invoice INV-2024-010 downloaded",   user:"Sarah Chen",         time:"Today, 11:05",   type:"read"   },
        { action:"New API key created",               user:"Mohammed Al-Rashid", time:"Yesterday, 16:40", type:"write" },
        { action:"User James Wilson invited",         user:"Mohammed Al-Rashid", time:"Oct 28, 09:15",  type:"write"  },
        { action:"Billing sync completed",            user:"System",             time:"Oct 28, 00:00",  type:"system" },
      ],
    },
    cmd: {
      placeholder:"Search pages, actions…",
      items:[
        { label:"Overview Dashboard",   page:"overview",  icon:"⬡" },
        { label:"Cost Analytics",       page:"analytics", icon:"◈" },
        { label:"Projects",             page:"projects",  icon:"◫" },
        { label:"Invoices",             page:"invoices",  icon:"◻" },
        { label:"Budgets & Alerts",     page:"budgets",   icon:"◑" },
        { label:"Reports",              page:"reports",   icon:"◧" },
        { label:"Settings",             page:"settings",  icon:"◎" },
      ],
    },
    appearance:"Appearance", language:"Language",
    darkMode:"Dark", lightMode:"Light",
    notificationsCount:"4 notifications",
    serviceNames:{ "Compute Engine":"Compute Engine","Cloud Storage":"Cloud Storage","BigQuery":"BigQuery","Cloud SQL":"Cloud SQL","Kubernetes Engine":"Kubernetes Engine","Networking":"Networking","Other":"Other" },
  },

  ar: {
    dir: "rtl",
    appName: "كلاود لنز",
    appSub: "منصة FinOps",
    billingAccount: "حساب الفوترة",
    liveSyncAgo: "مزامنة حية · منذ دقيقتين",
    search: "بحث…",
    nav: { overview:"نظرة عامة", analytics:"تحليل التكاليف", projects:"المشاريع", invoices:"الفواتير", budgets:"الميزانيات", reports:"التقارير", settings:"الإعدادات" },
    dateRange: "١ أكتوبر – ٣١ أكتوبر ٢٠٢٤",
    vsLastMonth: "مقارنةً بالشهر الماضي",
    thisMonth: "هذا الشهر",
    kpi: {
      mtd:"الإنفاق الشهري", mtdSub:"أكتوبر ٢٠٢٤",
      projected:"التوقع الشهري", projectedSub:"توقع",
      activeProjects:"المشاريع النشطة", activeProjectsSub:"عبر ٣ بيئات",
      budgetUtil:"استخدام الميزانية", budgetUtilSub:"حد ١٠٠ ألف دولار",
      ytd:"إجمالي العام", ytdSub:"يناير–أكتوبر ٢٠٢٤",
      avgDaily:"متوسط التكلفة اليومية", avgDailySub:"متوسط ٣٠ يومًا",
      anomalies:"شذوذات التكاليف", anomaliesSub:"آخر ٣٠ يومًا",
      outstanding:"المبالغ المستحقة", outstandingSub:"جميع الفواتير مدفوعة",
      lastInvoice:"آخر فاتورة", lastInvoiceSub:"أكتوبر ٢٠٢٤",
      ytdInvoiced:"مجموع فواتير العام", ytdInvoicedSub:"١٠ فواتير",
    },
    charts: {
      monthlyCostTrend:"اتجاه التكلفة الشهرية", monthlyCostSub:"الفعلي مقابل التوقع · ٢٠٢٤",
      serviceBreakdown:"تفصيل الخدمات", serviceBreakdownSub:"حسب التكلفة، هذا الشهر",
      actual:"فعلي", forecast:"توقع",
    },
    tables: {
      topProjects:"أعلى المشاريع إنفاقًا", topProjectsSub:"فترة الفوترة الحالية",
      viewAll:"عرض الكل", export:"تصدير", exportCsv:"تصدير CSV",
      activeAlerts:"التنبيهات النشطة",
      project:"المشروع", environment:"البيئة", mtdCost:"تكلفة الشهر",
      budget:"الميزانية", utilization:"الاستخدام", status:"الحالة",
      service:"الخدمة", cost:"التكلفة", pctOfTotal:"% من الإجمالي",
      vsLastMonth:"مقابل الشهر الماضي", trend:"الاتجاه",
      regional:"التوزيع الجغرافي", regionalSub:"التكلفة حسب المنطقة",
    },
    badge: { healthy:"طبيعي", warning:"تحذير", over:"تجاوز الميزانية", critical:"حرج", exceeded:"تجاوز", paid:"مدفوع", pending:"معلق", active:"نشط" },
    env: { Production:"إنتاج", Staging:"تجريبي", Development:"تطوير" },
    alerts: [
      { type:"critical", msg:"ml-training-v3 تجاوز الميزانية بنسبة ١٥.٦٪",               time:"منذ ساعتين" },
      { type:"warning",  msg:"Compute Engine وصل ٩٦٪ من الميزانية الشهرية",              time:"منذ ٤ ساعات" },
      { type:"warning",  msg:"تكاليف BigQuery ارتفعت ٢٨.٧٪ مقارنةً بالشهر الماضي",     time:"منذ ٦ ساعات" },
      { type:"info",     msg:"تقرير أكتوبر ٢٠٢٤ جاهز للتنزيل",                          time:"منذ يوم" },
    ],
    invoices: {
      history:"سجل الفواتير", historySub:"جميع فترات الفوترة",
      downloadAll:"تحميل الكل",
      invoiceId:"رقم الفاتورة", period:"فترة الفوترة",
      amount:"المبلغ", status:"الحالة", action:"إجراء", download:"↓ PDF",
    },
    budgets: { overBy:"⚠ تجاوز الميزانية بمقدار" },
    reports: {
      generate:"إنشاء تقرير", generateSub:"تصدير بيانات الفوترة بصيغ متعددة",
      scheduled:"التقارير المجدولة", scheduledSub:"إعداد التسليم التلقائي",
      newSchedule:"+ جدولة جديدة", edit:"تعديل",
      types:[
        { title:"ملخص التكاليف",      desc:"تفصيل شهري للتكاليف حسب الخدمة والمشروع" },
        { title:"الفوترة التفصيلية",  desc:"تصدير الفوترة على مستوى SKU بجميع البنود" },
        { title:"تقرير الميزانية",    desc:"استخدام الميزانية وتحليل التوقعات" },
      ],
      schedules:[
        { name:"ملخص شهري للإدارة",      freq:"أول كل شهر",        recipients:"team@company.com",    format:"PDF" },
        { name:"ملخص التكاليف الأسبوعي", freq:"كل إثنين",           recipients:"devops@company.com",  format:"CSV" },
        { name:"تقرير تنبيه الميزانية",  freq:"عند تجاوز الحد",    recipients:"finance@company.com", format:"PDF" },
      ],
    },
    settings: {
      apiKeys:"مفاتيح API", apiKeysSub:"إدارة بيانات اعتماد حساب الخدمة", newKey:"+ مفتاح جديد",
      team:"أعضاء الفريق", teamSub:"٣ أعضاء", invite:"دعوة",
      audit:"سجل التدقيق", auditSub:"النشاط الأخير للنظام",
      created:"تاريخ الإنشاء", lastUsed:"آخر استخدام",
      appearanceTitle:"المظهر واللغة",
      keys:[
        { name:"حساب خدمة الإنتاج",   created:"١٥ يناير ٢٠٢٤", last:"منذ ساعتين",  status:"active" },
        { name:"BigQuery للقراءة فقط", created:"٣ مارس ٢٠٢٤",   last:"منذ ٥ أيام",  status:"active" },
      ],
      members:[
        { name:"محمد الراشد",   role:"مالك",   email:"m@company.com" },
        { name:"سارة تشن",      role:"مدير",   email:"s@company.com" },
        { name:"جيمس ويلسون",   role:"مشاهد",  email:"j@company.com" },
      ],
      logs:[
        { action:"تم تحديث حد الميزانية",            user:"محمد الراشد", time:"اليوم، ١٤:٢٣",      type:"write"  },
        { action:"تم تحميل الفاتورة INV-2024-010",   user:"سارة تشن",    time:"اليوم، ١١:٠٥",      type:"read"   },
        { action:"تم إنشاء مفتاح API جديد",          user:"محمد الراشد", time:"أمس، ١٦:٤٠",        type:"write"  },
        { action:"تمت دعوة المستخدم جيمس ويلسون",   user:"محمد الراشد", time:"٢٨ أكتوبر، ٠٩:١٥", type:"write"  },
        { action:"اكتملت مزامنة الفوترة",            user:"النظام",       time:"٢٨ أكتوبر، ٠٠:٠٠", type:"system" },
      ],
    },
    cmd: {
      placeholder:"ابحث عن صفحات وإجراءات…",
      items:[
        { label:"لوحة النظرة العامة",    page:"overview",  icon:"⬡" },
        { label:"تحليل التكاليف",        page:"analytics", icon:"◈" },
        { label:"المشاريع",              page:"projects",  icon:"◫" },
        { label:"الفواتير",              page:"invoices",  icon:"◻" },
        { label:"الميزانيات والتنبيهات", page:"budgets",   icon:"◑" },
        { label:"التقارير",              page:"reports",   icon:"◧" },
        { label:"الإعدادات",             page:"settings",  icon:"◎" },
      ],
    },
    appearance:"المظهر", language:"اللغة",
    darkMode:"داكن", lightMode:"فاتح",
    notificationsCount:"٤ إشعارات",
    serviceNames:{ "Compute Engine":"كومبيوت إنجن","Cloud Storage":"التخزين السحابي","BigQuery":"BigQuery","Cloud SQL":"Cloud SQL","Kubernetes Engine":"كوبيرنيتس","Networking":"الشبكات","Other":"أخرى" },
  },
};

// ═══════════════════════════════════════════════════════════
// ─── THEME TOKENS
// ═══════════════════════════════════════════════════════════
const DARK = {
  bg:"#080C18",
  bgGrad:"radial-gradient(ellipse at 20% 0%, rgba(79,142,247,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.05) 0%, transparent 60%), #080C18",
  sidebar:"rgba(255,255,255,0.02)", sidebarBorder:"rgba(255,255,255,0.06)",
  headerBg:"rgba(8,12,24,0.85)", headerBorder:"rgba(255,255,255,0.06)",
  card:"rgba(255,255,255,0.03)", cardBorder:"rgba(255,255,255,0.07)",
  text:"#FFFFFF", textSub:"rgba(255,255,255,0.5)",
  textMuted:"rgba(255,255,255,0.3)", textLabel:"rgba(255,255,255,0.3)",
  tableRowBorder:"rgba(255,255,255,0.04)", tableSectionBorder:"rgba(255,255,255,0.07)",
  inputBg:"rgba(255,255,255,0.04)", inputBorder:"rgba(255,255,255,0.09)",
  orgBg:"rgba(255,255,255,0.04)", orgBorder:"rgba(255,255,255,0.07)",
  activeNavBg:"rgba(79,142,247,0.12)", activeNavBorder:"rgba(79,142,247,0.2)", activeNavColor:"#4F8EF7",
  inactiveNavColor:"rgba(255,255,255,0.45)",
  hoverBg:"rgba(255,255,255,0.05)",
  scrollbar:"rgba(255,255,255,0.1)",
  progressTrack:"rgba(255,255,255,0.07)",
  gridLine:"rgba(255,255,255,0.05)",
  donutInner:"rgba(12,18,32,0.97)",
  cmdBg:"rgba(14,20,36,0.99)", cmdBorder:"rgba(255,255,255,0.12)",
  kbdBg:"rgba(255,255,255,0.08)", kbdBorder:"rgba(255,255,255,0.12)",
  toggleBg:"rgba(255,255,255,0.06)", toggleBorder:"rgba(255,255,255,0.1)",
  toggleActiveBg:"rgba(255,255,255,0.12)",
  reportCardBorder:"rgba(255,255,255,0.08)",
  notifDotBg:"#080C18",
  envProdBg:"rgba(79,142,247,0.12)", envProdColor:"#6BA4F8",
  envStagBg:"rgba(245,158,11,0.12)", envStagColor:"#F59E0B",
  envDevBg:"rgba(107,114,128,0.12)", envDevColor:"#9CA3AF",
};

const LIGHT = {
  bg:"#F1F4F9",
  bgGrad:"radial-gradient(ellipse at 20% 0%, rgba(79,142,247,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.04) 0%, transparent 60%), #F1F4F9",
  sidebar:"#FFFFFF", sidebarBorder:"rgba(0,0,0,0.08)",
  headerBg:"rgba(241,244,249,0.92)", headerBorder:"rgba(0,0,0,0.08)",
  card:"#FFFFFF", cardBorder:"rgba(0,0,0,0.08)",
  text:"#0D1424", textSub:"rgba(13,20,36,0.6)",
  textMuted:"rgba(13,20,36,0.38)", textLabel:"rgba(13,20,36,0.4)",
  tableRowBorder:"rgba(0,0,0,0.05)", tableSectionBorder:"rgba(0,0,0,0.08)",
  inputBg:"rgba(0,0,0,0.04)", inputBorder:"rgba(0,0,0,0.1)",
  orgBg:"rgba(0,0,0,0.04)", orgBorder:"rgba(0,0,0,0.08)",
  activeNavBg:"rgba(59,126,232,0.09)", activeNavBorder:"rgba(59,126,232,0.2)", activeNavColor:"#2563EB",
  inactiveNavColor:"rgba(13,20,36,0.45)",
  hoverBg:"rgba(0,0,0,0.04)",
  scrollbar:"rgba(0,0,0,0.15)",
  progressTrack:"rgba(0,0,0,0.07)",
  gridLine:"rgba(0,0,0,0.06)",
  donutInner:"#FFFFFF",
  cmdBg:"rgba(255,255,255,0.99)", cmdBorder:"rgba(0,0,0,0.12)",
  kbdBg:"rgba(0,0,0,0.06)", kbdBorder:"rgba(0,0,0,0.1)",
  toggleBg:"rgba(0,0,0,0.05)", toggleBorder:"rgba(0,0,0,0.1)",
  toggleActiveBg:"rgba(0,0,0,0.09)",
  reportCardBorder:"rgba(0,0,0,0.08)",
  notifDotBg:"#F1F4F9",
  envProdBg:"rgba(37,99,235,0.09)", envProdColor:"#2563EB",
  envStagBg:"rgba(180,83,9,0.09)", envStagColor:"#B45309",
  envDevBg:"rgba(75,85,99,0.09)", envDevColor:"#4B5563",
};

// ═══════════════════════════════════════════════════════════
// ─── CONTEXT
// ═══════════════════════════════════════════════════════════
const AppCtx = createContext({});
const useApp = () => useContext(AppCtx);

// ═══════════════════════════════════════════════════════════
// ─── DATA
// ═══════════════════════════════════════════════════════════
const MONTHLY_COST = [
  {month:"Jan",cost:48200,forecast:null},{month:"Feb",cost:52100,forecast:null},
  {month:"Mar",cost:61400,forecast:null},{month:"Apr",cost:58900,forecast:null},
  {month:"May",cost:74300,forecast:null},{month:"Jun",cost:69800,forecast:null},
  {month:"Jul",cost:82100,forecast:null},{month:"Aug",cost:91200,forecast:null},
  {month:"Sep",cost:88600,forecast:null},{month:"Oct",cost:94100,forecast:null},
  {month:"Nov",cost:null,forecast:98400},{month:"Dec",cost:null,forecast:103200},
];
const DAILY=[3200,2900,3400,3100,4200,3800,2600,3500,3300,4100,3700,3900,4400,3600,3200,4600,4200,3800,4900,4300,3700,4100,5200,4800,4400,5100,4600,5400,4900,5200];
const SERVICES=[
  {name:"Compute Engine",   cost:38420, pct:40.8, change:+12.4, color:"#4F8EF7"},
  {name:"Cloud Storage",    cost:18210, pct:19.3, change:+3.1,  color:"#34D399"},
  {name:"BigQuery",         cost:14890, pct:15.8, change:+28.7, color:"#F59E0B"},
  {name:"Cloud SQL",        cost:9340,  pct:9.9,  change:-2.3,  color:"#A78BFA"},
  {name:"Kubernetes Engine",cost:7120,  pct:7.6,  change:+5.8,  color:"#F87171"},
  {name:"Networking",       cost:4320,  pct:4.6,  change:+1.2,  color:"#38BDF8"},
  {name:"Other",            cost:1900,  pct:2.0,  change:-0.8,  color:"#6B7280"},
];
const PROJECTS=[
  {id:"proj-001",name:"prod-api-cluster", env:"Production",  cost:31240,budget:35000,change:+8.2,  status:"healthy"},
  {id:"proj-002",name:"ml-training-v3",   env:"Production",  cost:28910,budget:25000,change:+34.1, status:"over"},
  {id:"proj-003",name:"data-pipeline-eu", env:"Production",  cost:14320,budget:20000,change:-3.4,  status:"healthy"},
  {id:"proj-004",name:"staging-infra",    env:"Staging",     cost:9840, budget:12000,change:+2.1,  status:"healthy"},
  {id:"proj-005",name:"analytics-bq",     env:"Production",  cost:7620, budget:8000, change:+22.8, status:"warning"},
  {id:"proj-006",name:"dev-sandbox",      env:"Development", cost:2270, budget:5000, change:-12.0, status:"healthy"},
];
const INVOICES_DATA=[
  {id:"INV-2024-010",period:"Oct 2024",amount:94100,status:"paid"},
  {id:"INV-2024-009",period:"Sep 2024",amount:88600,status:"paid"},
  {id:"INV-2024-008",period:"Aug 2024",amount:91200,status:"paid"},
  {id:"INV-2024-007",period:"Jul 2024",amount:82100,status:"paid"},
  {id:"INV-2024-006",period:"Jun 2024",amount:69800,status:"paid"},
];
const BUDGETS_DATA=[
  {name:"Compute Engine",limit:40000, spent:38420,pct:96.1,  status:"critical"},
  {name:"ML Training",   limit:25000, spent:28910,pct:115.6, status:"exceeded"},
  {name:"Data Pipeline", limit:20000, spent:14320,pct:71.6,  status:"healthy"},
  {name:"Total Monthly", limit:100000,spent:94100,pct:94.1,  status:"warning"},
];
const REGIONS=[
  {name:"us-central1",  cost:42100,pct:44.7},
  {name:"europe-west1", cost:21300,pct:22.6},
  {name:"us-east1",     cost:14800,pct:15.7},
  {name:"asia-east1",   cost:9200, pct:9.8},
  {name:"us-west2",     cost:6700, pct:7.2},
];
const NAV_ICONS={overview:"⬡",analytics:"◈",projects:"◫",invoices:"◻",budgets:"◑",reports:"◧",settings:"◎"};

const fmt     = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(1)}K` : `$${n}`;
const fmtFull = (n: number) => `$${n.toLocaleString()}`;

// ═══════════════════════════════════════════════════════════
// ─── TOGGLE CONTROLS
// ═══════════════════════════════════════════════════════════
function SegmentControl({ options, value, onChange }) {
  const { T } = useApp();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, background:T.toggleBg, border:`1px solid ${T.toggleBorder}`, borderRadius:10, padding:3 }}>
      {options.map(opt => {
        const active = value === opt.val;
        return (
          <button key={String(opt.val)} onClick={() => onChange(opt.val)} style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"5px 12px", borderRadius:7, border:"none", cursor:"pointer",
            background: active ? T.toggleActiveBg : "transparent",
            color: active ? T.text : T.textMuted,
            fontSize:12, fontWeight: active ? 600 : 500,
            transition:"all 0.15s",
          }}>
            <span style={{fontSize:13}}>{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════
function Badge({ status }) {
  const { t } = useApp();
  const map = {
    healthy: {bg:"rgba(52,211,153,0.12)",  color:"#34D399"},
    warning: {bg:"rgba(245,158,11,0.12)",  color:"#F59E0B"},
    over:    {bg:"rgba(248,113,113,0.12)", color:"#F87171"},
    critical:{bg:"rgba(248,113,113,0.12)", color:"#F87171"},
    exceeded:{bg:"rgba(239,68,68,0.15)",   color:"#EF4444"},
    paid:    {bg:"rgba(52,211,153,0.12)",  color:"#34D399"},
    pending: {bg:"rgba(245,158,11,0.12)",  color:"#F59E0B"},
    active:  {bg:"rgba(52,211,153,0.12)",  color:"#34D399"},
  };
  const s = map[status] || map.healthy;
  return (
    <span style={{background:s.bg, color:s.color, fontSize:11, fontWeight:600, letterSpacing:"0.04em", padding:"3px 10px", borderRadius:20}}>
      {t.badge[status] || status}
    </span>
  );
}

function Change({ v }) {
  const up = v >= 0;
  return <span style={{color: up?"#F87171":"#34D399", fontSize:12, fontWeight:600}}>{up?"↑":"↓"} {Math.abs(v)}%</span>;
}

function AlertDot({ type }) {
  return <span style={{width:7,height:7,borderRadius:"50%",background:{critical:"#EF4444",warning:"#F59E0B",info:"#4F8EF7"}[type]||"#6B7280",display:"inline-block",flexShrink:0,marginTop:5}} />;
}

function EnvBadge({ env }) {
  const { T, t } = useApp();
  const s = env==="Production" ? {bg:T.envProdBg,color:T.envProdColor}
          : env==="Staging"    ? {bg:T.envStagBg,color:T.envStagColor}
          :                      {bg:T.envDevBg,  color:T.envDevColor};
  return <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:s.bg,color:s.color}}>{t.env[env]||env}</span>;
}

// ─── SparkLine
function SparkLine({ data, color="#4F8EF7", h=40, w=120 }) {
  const max=Math.max(...data), min=Math.min(...data);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*h}`).join(" ");
  const area=`0,${h} ${pts} ${w},${h}`;
  const gid=`sg${color.replace("#","")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={area} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── BarChart
function BarChart({ data }) {
  const { T } = useApp();
  const max=Math.max(...data.map(d=>Math.max(d.cost||0,d.forecast||0)));
  const W=680,H=200,BAR_W=28,GAP=(W-data.length*BAR_W)/data.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H+30}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F8EF7" stopOpacity="0.9"/><stop offset="100%" stopColor="#4F8EF7" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="fcG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      {[0,.25,.5,.75,1].map((tick,i)=>(
        <g key={i}>
          <line x1={0} y1={H-H*tick} x2={W} y2={H-H*tick} stroke={T.gridLine} strokeWidth={1}/>
          <text x={-8} y={H-H*tick+4} fill={T.textLabel} fontSize={10} textAnchor="end">{fmt(max*tick)}</text>
        </g>
      ))}
      {data.map((d,i)=>{
        const x=i*(BAR_W+GAP)+GAP/2, val=d.cost||d.forecast||0, bh=(val/max)*H, isFc=d.forecast!=null;
        return (
          <g key={i}>
            <rect x={x} y={H-bh} width={BAR_W} height={bh} fill={isFc?"url(#fcG)":"url(#barG)"} rx={4} opacity={isFc?.7:1}
              style={{filter:isFc?"none":"drop-shadow(0 2px 8px rgba(79,142,247,0.3))"}}/>
            {isFc&&<rect x={x} y={H-bh} width={BAR_W} height={bh} rx={4} fill="none" stroke="#A78BFA" strokeWidth={1} strokeDasharray="3,2" opacity={.6}/>}
            <text x={x+BAR_W/2} y={H+18} fill={T.textLabel} fontSize={10} textAnchor="middle">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── DonutChart
function DonutChart({ data, size=160 }) {
  const { t, T } = useApp();
  const r=size/2-16, cx=size/2, cy=size/2;
  const total=data.reduce((s,d)=>s+d.cost,0);
  let cum=-Math.PI/2;
  const slices=data.map(d=>{const angle=(d.cost/total)*2*Math.PI,sa=cum;cum+=angle;return{...d,sa,ea:cum};});
  const arc=(sa,ea,ri=r,ro=r+14)=>{
    const x1o=cx+ro*Math.cos(sa),y1o=cy+ro*Math.sin(sa);
    const x2o=cx+ro*Math.cos(ea),y2o=cy+ro*Math.sin(ea);
    const x1i=cx+ri*Math.cos(ea),y1i=cy+ri*Math.sin(ea);
    const x2i=cx+ri*Math.cos(sa),y2i=cy+ri*Math.sin(sa);
    const lg=ea-sa>Math.PI?1:0;
    return `M${x1o},${y1o} A${ro},${ro} 0 ${lg} 1 ${x2o},${y2o} L${x1i},${y1i} A${ri},${ri} 0 ${lg} 0 ${x2i},${y2i} Z`;
  };
  return (
    <svg width={size} height={size}>
      {slices.map((s,i)=>(
        <path key={i} d={arc(s.sa,s.ea)} fill={s.color} opacity={0.9} style={{filter:`drop-shadow(0 2px 6px ${s.color}40)`}}/>
      ))}
      <circle cx={cx} cy={cy} r={r-2} fill={T.donutInner}/>
      <text x={cx} y={cy-8} textAnchor="middle" fill={T.text} fontSize={18} fontWeight="700">{fmt(total)}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill={T.textSub} fontSize={10}>{t.thisMonth}</text>
    </svg>
  );
}

// ─── KPICard
function KPICard({ label, value, sub, change, spark, accent="#4F8EF7" }) {
  const { t, T } = useApp();
  return (
    <div style={{background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:16, padding:"20px 24px", display:"flex", flexDirection:"column", gap:12, position:"relative", overflow:"hidden", boxShadow: T===LIGHT?"0 1px 4px rgba(0,0,0,0.06)":"none"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accent}60,transparent)`}}/>
      <div style={{fontSize:12,color:T.textSub,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:28,fontWeight:700,color:T.text,lineHeight:1,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>{value}</div>
          {sub && <div style={{fontSize:12,color:T.textMuted,marginTop:6}}>{sub}</div>}
          {change!==undefined && <div style={{marginTop:8}}><Change v={change}/> <span style={{fontSize:11,color:T.textMuted}}>{t.vsLastMonth}</span></div>}
        </div>
        {spark && <SparkLine data={spark} color={accent}/>}
      </div>
    </div>
  );
}

// ─── Card
function Card({ children, style={} }) {
  const { T } = useApp();
  return (
    <div style={{background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:16, padding:24, boxShadow: T===LIGHT?"0 1px 4px rgba(0,0,0,0.06)":"none", ...style}}>
      {children}
    </div>
  );
}

// ─── SectionHeader
function SectionHeader({ title, sub, action }) {
  const { T } = useApp();
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div>
        <div style={{fontSize:16,fontWeight:700,color:T.text,letterSpacing:"-0.01em"}}>{title}</div>
        {sub && <div style={{fontSize:12,color:T.textSub,marginTop:2}}>{sub}</div>}
      </div>
      {action && <button style={{fontSize:12,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:500}}>{action}</button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── PAGES
// ═══════════════════════════════════════════════════════════

function OverviewPage() {
  const { t, T } = useApp();
  const spark = DAILY.slice(-14);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <KPICard label={t.kpi.mtd}           value="$94,100" sub={t.kpi.mtdSub}            change={+6.2}  spark={spark} accent="#4F8EF7"/>
        <KPICard label={t.kpi.projected}     value="$98,400" sub={t.kpi.projectedSub}      change={+4.6}  spark={spark.map(v=>v*1.05)} accent="#A78BFA"/>
        <KPICard label={t.kpi.activeProjects} value="6"      sub={t.kpi.activeProjectsSub}               accent="#34D399"/>
        <KPICard label={t.kpi.budgetUtil}    value="94.1%"   sub={t.kpi.budgetUtilSub}     change={+6.2}  spark={[72,75,78,80,82,85,88,90,91,93,94,94]} accent="#F59E0B"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}>
        <Card>
          <SectionHeader title={t.charts.monthlyCostTrend} sub={t.charts.monthlyCostSub} action={t.tables.export}/>
          <div style={{overflowX:"auto"}}><BarChart data={MONTHLY_COST}/></div>
          <div style={{display:"flex",gap:20,marginTop:16}}>
            {[{color:"#4F8EF7",label:t.charts.actual},{color:"#A78BFA",label:t.charts.forecast}].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:12,height:12,borderRadius:3,background:l.color}}/>
                <span style={{fontSize:12,color:T.textSub}}>{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title={t.charts.serviceBreakdown} sub={t.charts.serviceBreakdownSub}/>
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><DonutChart data={SERVICES} size={180}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {SERVICES.slice(0,5).map(s=>(
              <div key={s.name} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                <span style={{fontSize:12,color:T.textSub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.serviceNames[s.name]||s.name}</span>
                <span style={{fontSize:12,fontWeight:600,color:T.text,fontFamily:"'DM Mono',monospace"}}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
        <Card>
          <SectionHeader title={t.tables.topProjects} sub={t.tables.topProjectsSub} action={t.tables.viewAll}/>
          {PROJECTS.map(p=>(
            <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.name}</div>
                <div style={{marginTop:4}}><EnvBadge env={p.env}/></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.cost)}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>/ {fmtFull(p.budget)}</div>
              </div>
              <Change v={p.change}/>
              <Badge status={p.status}/>
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title={t.tables.activeAlerts} sub={t.notificationsCount}/>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {t.alerts.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10}}>
                <AlertDot type={a.type}/>
                <div>
                  <div style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{a.msg}</div>
                  <div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const { t, T } = useApp();
  const spark = DAILY.slice(-14);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        <KPICard label={t.kpi.ytd}      value="$720,800" sub={t.kpi.ytdSub}      change={+18.4} spark={MONTHLY_COST.filter(d=>d.cost).map(d=>d.cost)} accent="#4F8EF7"/>
        <KPICard label={t.kpi.avgDaily} value="$3,137"   sub={t.kpi.avgDailySub} change={+6.2}  spark={spark} accent="#34D399"/>
        <KPICard label={t.kpi.anomalies} value="3"       sub={t.kpi.anomaliesSub}               accent="#F87171"/>
      </div>
      <Card>
        <SectionHeader title={t.charts.serviceBreakdown} sub={`${t.charts.serviceBreakdownSub} · Oct 2024`} action={t.tables.exportCsv}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:"0 24px"}}>
          {[t.tables.service,t.tables.cost,t.tables.pctOfTotal,t.tables.vsLastMonth,t.tables.trend].map(h=>(
            <div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 12px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>
          ))}
          {SERVICES.map(s=>(
            <div key={s.name} style={{display:"contents"}}>
              <div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:s.color}}/>
                <span style={{fontSize:13,color:T.text,fontWeight:500}}>{t.serviceNames[s.name]||s.name}</span>
              </div>
              <div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(s.cost)}</div>
              <div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
                <div style={{height:6,borderRadius:3,background:T.progressTrack,overflow:"hidden",width:100}}>
                  <div style={{height:"100%",width:`${s.pct}%`,background:s.color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:11,color:T.textSub,marginTop:4}}>{s.pct}%</div>
              </div>
              <div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Change v={s.change}/></div>
              <div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
                <SparkLine data={DAILY.slice(-10).map(v=>v*(s.pct/100))} color={s.color} w={80} h={28}/>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title={t.tables.regional} sub={t.tables.regionalSub}/>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {REGIONS.map(r=>(
            <div key={r.name} style={{display:"grid",gridTemplateColumns:"140px 1fr 80px 60px",alignItems:"center",gap:16}}>
              <span style={{fontSize:12,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{r.name}</span>
              <div style={{height:8,borderRadius:4,background:T.progressTrack,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${r.pct}%`,background:"linear-gradient(90deg,#4F8EF7,#A78BFA)",borderRadius:4}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace",textAlign:"right"}}>{fmt(r.cost)}</span>
              <span style={{fontSize:12,color:T.textMuted,textAlign:"right"}}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProjectsPage() {
  const { t, T } = useApp();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <Card>
        <SectionHeader title={t.nav.projects} sub="6 active projects" action="+ Add Project"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto auto",gap:"0 20px"}}>
          {[t.tables.project,t.tables.environment,t.tables.mtdCost,t.tables.budget,t.tables.utilization,t.tables.status].map(h=>(
            <div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 14px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>
          ))}
          {PROJECTS.map(p=>{
            const util=(p.cost/p.budget)*100;
            return (
              <div key={p.id} style={{display:"contents"}}>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.name}</div>
                  <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{p.id}</div>
                </div>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><EnvBadge env={p.env}/></div>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.cost)}</div>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.budget)}</div>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1,height:6,borderRadius:3,background:T.progressTrack,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(util,100)}%`,borderRadius:3,background:util>100?"#EF4444":util>90?"#F59E0B":"#34D399"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:util>100?"#EF4444":util>90?"#F59E0B":"#34D399",minWidth:40}}>{util.toFixed(0)}%</span>
                  </div>
                </div>
                <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Badge status={p.status}/></div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function InvoicesPage() {
  const { t, T } = useApp();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        <KPICard label={t.kpi.outstanding}  value="$0.00"    sub={t.kpi.outstandingSub}  accent="#34D399"/>
        <KPICard label={t.kpi.lastInvoice}  value="$94,100"  sub={t.kpi.lastInvoiceSub}  accent="#4F8EF7"/>
        <KPICard label={t.kpi.ytdInvoiced}  value="$720,800" sub={t.kpi.ytdInvoicedSub}  accent="#A78BFA"/>
      </div>
      <Card>
        <SectionHeader title={t.invoices.history} sub={t.invoices.historySub} action={t.invoices.downloadAll}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto auto auto",gap:"0 24px"}}>
          {[t.invoices.invoiceId,t.invoices.period,t.invoices.amount,t.invoices.status,t.invoices.action].map(h=>(
            <div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 14px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>
          ))}
          {INVOICES_DATA.map(inv=>(
            <div key={inv.id} style={{display:"contents"}}>
              <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.text,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{inv.id}</div>
              <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.textSub}}>{inv.period}</div>
              <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(inv.amount)}</div>
              <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Badge status={inv.status}/></div>
              <div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
                <button style={{fontSize:12,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:500}}>{t.invoices.download}</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BudgetsPage() {
  const { t, T } = useApp();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
        {BUDGETS_DATA.map(b=>{
          const over=b.pct>100;
          const color=b.pct>100?"#EF4444":b.pct>90?"#F59E0B":"#34D399";
          return (
            <Card key={b.name}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:T.text}}>{b.name}</div>
                  <div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{fmtFull(b.limit)}</div>
                </div>
                <Badge status={b.status}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:22,fontWeight:800,color:over?"#EF4444":T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(b.spent)}</span>
                <span style={{fontSize:28,fontWeight:800,color,fontFamily:"'DM Mono',monospace"}}>{b.pct}%</span>
              </div>
              <div style={{height:10,borderRadius:5,background:T.progressTrack,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(b.pct,100)}%`,borderRadius:5,background:color,boxShadow:`0 0 12px ${color}60`,transition:"width 0.8s ease"}}/>
              </div>
              {over && <div style={{fontSize:12,color:"#EF4444",marginTop:8}}>{t.budgets.overBy} {fmtFull(b.spent-b.limit)}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ReportsPage() {
  const { t, T } = useApp();
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <Card>
        <SectionHeader title={t.reports.generate} sub={t.reports.generateSub}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:8}}>
          {t.reports.types.map((r,i)=>(
            <div key={i} style={{border:`1px solid ${T.reportCardBorder}`,borderRadius:12,padding:20,cursor:"pointer"}}>
              <div style={{fontSize:22,marginBottom:10}}>{"◈◻◑"[i]}</div>
              <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{r.title}</div>
              <div style={{fontSize:12,color:T.textSub,lineHeight:1.6,marginBottom:16}}>{r.desc}</div>
              <div style={{display:"flex",gap:8}}>
                <button style={{fontSize:11,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:600}}>CSV</button>
                <button style={{fontSize:11,color:"#A78BFA",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:600}}>PDF</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHeader title={t.reports.scheduled} sub={t.reports.scheduledSub} action={t.reports.newSchedule}/>
        {t.reports.schedules.map((s,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:20,padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div>
              <div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{s.freq} → {s.recipients}</div>
            </div>
            <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(79,142,247,0.1)",color:"#4F8EF7",fontWeight:600}}>{s.format}</span>
            <Badge status="active"/>
            <button style={{fontSize:12,color:T.textSub,background:"transparent",border:`1px solid ${T.cardBorder}`,borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>{t.reports.edit}</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function SettingsPage() {
  const { t, T, dark, setDark, lang, setLang } = useApp();
  const themeOpts=[{val:false,icon:"☀",label:t.lightMode},{val:true,icon:"🌙",label:t.darkMode}];
  const langOpts=[{val:"en",icon:"🇺🇸",label:"English"},{val:"ar",icon:"🇸🇦",label:"العربية"}];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      {/* Appearance Card */}
      <Card>
        <SectionHeader title={t.settings.appearanceTitle}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
          <div>
            <div style={{fontSize:12,color:T.textSub,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12}}>{t.appearance}</div>
            <SegmentControl options={themeOpts} value={dark} onChange={setDark}/>
          </div>
          <div>
            <div style={{fontSize:12,color:T.textSub,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12}}>{t.language}</div>
            <SegmentControl options={langOpts} value={lang} onChange={setLang}/>
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SectionHeader title={t.settings.apiKeys} sub={t.settings.apiKeysSub} action={t.settings.newKey}/>
          {t.settings.keys.map((k,i)=>(
            <div key={i} style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{k.name}</div>
                  <div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{t.settings.created} {k.created} · {t.settings.lastUsed} {k.last}</div>
                </div>
                <Badge status={k.status}/>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title={t.settings.team} sub={t.settings.teamSub} action={t.settings.invite}/>
          {t.settings.members.map((u,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`hsl(${i*80+200},65%,42%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white",flexShrink:0}}>{u.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{u.name}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{u.email}</div>
              </div>
              <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:T.toggleBg,color:T.textSub,fontWeight:600}}>{u.role}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionHeader title={t.settings.audit} sub={t.settings.auditSub}/>
        {t.settings.logs.map((log,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:log.type==="write"?"#F59E0B":log.type==="system"?"#4F8EF7":"#34D399"}}/>
            <div style={{fontSize:13,color:T.textSub}}>{log.action}</div>
            <div style={{fontSize:12,color:T.textMuted}}>{log.user}</div>
            <div style={{fontSize:11,color:T.textMuted}}>{log.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── COMMAND PALETTE
// ═══════════════════════════════════════════════════════════
function CommandPalette({ onClose, onNav }) {
  const { t, T } = useApp();
  const [q, setQ] = useState("");
  const items = t.cmd.items.filter(i => i.label.includes(q) || i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:120}} onClick={onClose}>
      <div style={{background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:16,width:560,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:`1px solid ${T.tableRowBorder}`}}>
          <span style={{fontSize:16,color:T.textMuted}}>⌕</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={t.cmd.placeholder}
            style={{flex:1,background:"none",border:"none",outline:"none",fontSize:15,color:T.text,fontFamily:"inherit"}}/>
          <kbd style={{fontSize:11,color:T.textMuted,background:T.kbdBg,border:`1px solid ${T.kbdBorder}`,borderRadius:6,padding:"2px 7px"}}>ESC</kbd>
        </div>
        <div style={{padding:8,maxHeight:360,overflowY:"auto"}}>
          {items.map(item=>(
            <div key={item.page} onClick={()=>{onNav(item.page);onClose();}}
              style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:10,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:14,color:T.textMuted}}>{item.icon}</span>
              <span style={{fontSize:14,color:T.textSub}}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── MAIN APP
// ═══════════════════════════════════════════════════════════
const PAGE_MAP = { overview:OverviewPage, analytics:AnalyticsPage, projects:ProjectsPage, invoices:InvoicesPage, budgets:BudgetsPage, reports:ReportsPage, settings:SettingsPage };

export default function App() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("overview");
  const [showCmd, setShowCmd] = useState(false);

  const T = dark ? DARK : LIGHT;
  const t = TRANSLATIONS[lang];
  const isRTL = t.dir === "rtl";

  useEffect(() => {
    const handler = e => {
      if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setShowCmd(v=>!v); }
      if (e.key==="Escape") setShowCmd(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const PageComponent = PAGE_MAP[page] || OverviewPage;
  const navItems = Object.entries(t.nav).map(([id,label])=>({id,label,icon:NAV_ICONS[id]}));
  const themeOpts=[{val:false,icon:"☀",label:t.lightMode},{val:true,icon:"🌙",label:t.darkMode}];
  const langOpts=[{val:"en",icon:"🇺🇸",label:"EN"},{val:"ar",icon:"🇸🇦",label:"AR"}];

  const fontFamily = isRTL ? "'Tajawal', 'DM Sans', sans-serif" : "'DM Sans', sans-serif";

  return (
    <AppCtx.Provider value={{ dark, setDark, lang, setLang, t, T }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&family=Tajawal:wght@400;500;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-family: ${fontFamily}; background: ${T.bg}; }
        body { font-family: ${fontFamily}; background: ${T.bg}; color: ${T.text}; transition: background 0.2s, color 0.2s; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollbar}; border-radius: 4px; }
        input, button, kbd { font-family: ${fontFamily}; }
      `}</style>

      {showCmd && <CommandPalette onClose={()=>setShowCmd(false)} onNav={setPage}/>}

      <div dir={t.dir} style={{display:"flex",minHeight:"100vh",flexDirection:isRTL?"row-reverse":"row",background:T.bgGrad,transition:"background 0.2s"}}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width:236, flexShrink:0, background:T.sidebar,
          borderInlineEnd:`1px solid ${T.sidebarBorder}`,
          display:"flex", flexDirection:"column", padding:"24px 0",
          position:"sticky", top:0, height:"100vh",
          transition:"background 0.2s, border-color 0.2s",
          boxShadow: !dark ? "1px 0 0 rgba(0,0,0,0.06)" : "none",
        }}>
          {/* Logo */}
          <div style={{padding:"0 20px 28px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#4F8EF7,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>☁</div>
              <div>
                <div style={{fontSize:14,fontWeight:800,color:T.text,letterSpacing:isRTL?0:"-0.02em"}}>{t.appName}</div>
                <div style={{fontSize:10,color:T.textMuted,fontWeight:500}}>{t.appSub}</div>
              </div>
            </div>
          </div>

          {/* Org Switcher */}
          <div style={{margin:"0 12px 20px",padding:"10px 12px",background:T.orgBg,borderRadius:10,border:`1px solid ${T.orgBorder}`,cursor:"pointer"}}>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:2}}>{t.billingAccount}</div>
            <div style={{fontSize:13,fontWeight:600,color:T.text,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>Enterprise Corp</span><span style={{color:T.textMuted,fontSize:10}}>⌄</span>
            </div>
          </div>

          {/* Nav */}
          <nav style={{flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2}}>
            {navItems.map(item=>{
              const active=page===item.id;
              return (
                <button key={item.id} onClick={()=>setPage(item.id)} style={{
                  display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,
                  background:active?T.activeNavBg:"transparent",
                  border:active?`1px solid ${T.activeNavBorder}`:"1px solid transparent",
                  color:active?T.activeNavColor:T.inactiveNavColor,
                  fontSize:13,fontWeight:active?600:500,cursor:"pointer",
                  width:"100%",textAlign:isRTL?"right":"left",
                  flexDirection:isRTL?"row-reverse":"row",
                  transition:"all 0.12s",
                }}
                  onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.hoverBg;}}
                  onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
                  <span style={{fontSize:14}}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom controls */}
          <div style={{padding:"16px 12px",borderTop:`1px solid ${T.sidebarBorder}`,marginTop:8,display:"flex",flexDirection:"column",gap:8}}>
            {/* Theme + Lang toggles */}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <SegmentControl options={themeOpts} value={dark} onChange={setDark}/>
              <SegmentControl options={langOpts}  value={lang} onChange={setLang}/>
            </div>
            {/* Sync */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 4px"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#34D399",boxShadow:"0 0 8px #34D39980",flexShrink:0}}/>
              <span style={{fontSize:11,color:T.textMuted}}>{t.liveSyncAgo}</span>
            </div>
            {/* Search shortcut */}
            <button onClick={()=>setShowCmd(true)} style={{
              width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
              background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:8,
              padding:"7px 10px",cursor:"pointer",color:T.textMuted,fontSize:12,
              flexDirection:isRTL?"row-reverse":"row",
            }}>
              <span>⌕ {t.search}</span>
              <kbd style={{fontSize:10,background:T.kbdBg,border:`1px solid ${T.kbdBorder}`,borderRadius:4,padding:"1px 5px",color:T.textMuted}}>⌘K</kbd>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"auto",minWidth:0}}>
          {/* Header */}
          <header style={{
            position:"sticky",top:0,zIndex:100,
            background:T.headerBg,backdropFilter:"blur(20px) saturate(180%)",
            borderBottom:`1px solid ${T.headerBorder}`,
            padding:"0 32px",height:60,
            display:"flex",alignItems:"center",justifyContent:"space-between",
            flexDirection:isRTL?"row-reverse":"row",
            transition:"background 0.2s",
          }}>
            <h1 style={{fontSize:16,fontWeight:700,color:T.text,letterSpacing:isRTL?0:"-0.01em"}}>{t.nav[page]}</h1>
            <div style={{display:"flex",alignItems:"center",gap:12,flexDirection:isRTL?"row-reverse":"row"}}>
              <div style={{background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10,padding:"6px 14px",fontSize:12,color:T.textSub,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                <span>📅</span> {t.dateRange} <span style={{color:T.textMuted,fontSize:10}}>⌄</span>
              </div>
              <div style={{position:"relative",cursor:"pointer"}}>
                <div style={{width:36,height:36,borderRadius:10,background:T.inputBg,border:`1px solid ${T.inputBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🔔</div>
                <div style={{position:"absolute",top:7,right:7,width:8,height:8,borderRadius:"50%",background:"#F87171",border:`2px solid ${T.notifDotBg}`}}/>
              </div>
              <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#4F8EF7,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",cursor:"pointer"}}>M</div>
            </div>
          </header>

          {/* Page Content */}
          <div style={{flex:1,padding:32}}>
            <PageComponent/>
          </div>
        </main>
      </div>
    </AppCtx.Provider>
  );
}
