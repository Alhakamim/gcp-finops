// @ts-nocheck
import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from './AuthContext';
import { getToken, auth as authApi, apiKeys as apiKeysApi, gcp as gcpApi } from './api';

const TRANSLATIONS = {
  en: {
    dir: "ltr", appName: "CntxtLens", appSub: "CNTXT FinOps",
    billingAccount: "Billing Account", liveSyncAgo: "Live Sync \u00b7 2m ago",
    search: "Search\u2026",
    nav: { overview:"Overview", analytics:"Cost Analytics", projects:"Projects", invoices:"Invoices", budgets:"Budgets", reports:"Reports", settings:"Settings" },
    dateRange: "Oct 1 \u2013 Oct 31, 2024", vsLastMonth: "vs last month", thisMonth: "This Month",
    kpi: {
      mtd:"MTD Spend", mtdSub:"Oct 2024", projected:"Projected Month", projectedSub:"Forecast",
      activeProjects:"Active Projects", activeProjectsSub:"Across 3 envs",
      budgetUtil:"Budget Utilization", budgetUtilSub:"$100K limit",
      ytd:"YTD Total", ytdSub:"Jan\u2013Oct 2024",
      avgDaily:"Avg Daily Cost", avgDailySub:"30-day rolling",
      anomalies:"Cost Anomalies", anomaliesSub:"Last 30 days",
      outstanding:"Outstanding", outstandingSub:"All invoices paid",
      lastInvoice:"Last Invoice", lastInvoiceSub:"Oct 2024",
      ytdInvoiced:"YTD Invoiced", ytdInvoicedSub:"10 invoices",
    },
    charts: {
      monthlyCostTrend:"Monthly Cost Trend", monthlyCostSub:"Actual vs Forecast \u00b7 2024",
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
      history:"Invoice History", historySub:"All billing periods", downloadAll:"Download All",
      invoiceId:"Invoice ID", period:"Billing Period", amount:"Amount", status:"Status", action:"Action", download:"\u2193 PDF",
    },
    budgets: { overBy:"\u26a0 Over budget by" },
    reports: {
      generate:"Generate Report", generateSub:"Export billing data in various formats",
      scheduled:"Scheduled Reports", scheduledSub:"Automated delivery configuration",
      newSchedule:"+ New Schedule", edit:"Edit",
      types:[
        { title:"Cost Summary", desc:"Monthly cost breakdown by service and project" },
        { title:"Detailed Billing", desc:"SKU-level billing export with all line items" },
        { title:"Budget Report", desc:"Budget utilization and forecast analysis" },
      ],
      schedules:[
        { name:"Monthly Executive Summary", freq:"1st of month", recipients:"team@company.com", format:"PDF" },
        { name:"Weekly Cost Digest", freq:"Every Monday", recipients:"devops@company.com", format:"CSV" },
        { name:"Budget Alert Report", freq:"When threshold hit", recipients:"finance@company.com", format:"PDF" },
      ],
    },
    settings: {
      apiKeys:"API Keys", apiKeysSub:"Manage service account credentials", newKey:"+ New Key",
      team:"Team Members", teamSub:"3 members", invite:"Invite",
      audit:"Audit Log", auditSub:"Recent system activity",
      created:"Created", lastUsed:"Last used",
      appearanceTitle:"Appearance & Language",
      billingAccounts:"Billing Accounts", billingAccountsSub:"Manage GCP billing accounts", addAccount:"+ Add Account",
      keys:[
        { name:"Production Service Account", created:"Jan 15, 2024", last:"2 hours ago", status:"active" },
        { name:"BigQuery Read-Only", created:"Mar 3, 2024", last:"5 days ago", status:"active" },
      ],
      members:[
        { name:"Mohammed Al-Rashid", role:"Owner", email:"m@company.com" },
        { name:"Sarah Chen", role:"Admin", email:"s@company.com" },
        { name:"James Wilson", role:"Viewer", email:"j@company.com" },
      ],
      logs:[
        { action:"Budget threshold updated", user:"Mohammed Al-Rashid", time:"Today, 14:23", type:"write" },
        { action:"Invoice INV-2024-010 downloaded", user:"Sarah Chen", time:"Today, 11:05", type:"read" },
        { action:"New API key created", user:"Mohammed Al-Rashid", time:"Yesterday, 16:40", type:"write" },
        { action:"User James Wilson invited", user:"Mohammed Al-Rashid", time:"Oct 28, 09:15", type:"write" },
        { action:"Billing sync completed", user:"System", time:"Oct 28, 00:00", type:"system" },
      ],
    },
    cmd: {
      placeholder:"Search pages, actions\u2026",
      items:[
        { label:"Overview Dashboard", page:"overview", icon:"\u2b21" },
        { label:"Cost Analytics", page:"analytics", icon:"\u25c8" },
        { label:"Projects", page:"projects", icon:"\u25eb" },
        { label:"Invoices", page:"invoices", icon:"\u25fb" },
        { label:"Budgets & Alerts", page:"budgets", icon:"\u25d1" },
        { label:"Reports", page:"reports", icon:"\u25e7" },
        { label:"Settings", page:"settings", icon:"\u25ce" },
      ],
    },
    appearance:"Appearance", language:"Language", darkMode:"Dark", lightMode:"Light",
    notificationsCount:"4 notifications",
    serviceNames:{ "Compute Engine":"Compute Engine","Cloud Storage":"Cloud Storage","BigQuery":"BigQuery","Cloud SQL":"Cloud SQL","Kubernetes Engine":"Kubernetes Engine","Networking":"Networking","Other":"Other" },
  },

  ar: {
    dir: "rtl", appName: "\u0643\u0646\u062a\u0643\u0633\u062a \u0644\u0646\u0632", appSub: "CNTXT FinOps",
    billingAccount: "\u062d\u0633\u0627\u0628 \u0627\u0644\u0641\u0648\u062a\u0631\u0629",
    liveSyncAgo: "\u0645\u0632\u0627\u0645\u0646\u0629 \u062d\u064a\u0629 \u00b7 \u0645\u0646\u0630 \u062f\u0642\u064a\u0642\u062a\u064a\u0646",
    search: "\u0628\u062d\u062b\u2026",
    nav: { overview:"\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629", analytics:"\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641", projects:"\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639", invoices:"\u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631", budgets:"\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0627\u062a", reports:"\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631", settings:"\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a" },
    dateRange: "\u0661 \u0623\u0643\u062a\u0648\u0628\u0631 \u2013 \u0663\u0661 \u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664",
    vsLastMonth: "\u0645\u0642\u0627\u0631\u0646\u0629\u064b \u0628\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0645\u0627\u0636\u064a",
    thisMonth: "\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    kpi: {
      mtd:"\u0627\u0644\u0625\u0646\u0641\u0627\u0642 \u0627\u0644\u0634\u0647\u0631\u064a", mtdSub:"\u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664",
      projected:"\u0627\u0644\u062a\u0648\u0642\u0639 \u0627\u0644\u0634\u0647\u0631\u064a", projectedSub:"\u062a\u0648\u0642\u0639",
      activeProjects:"\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u0646\u0634\u0637\u0629", activeProjectsSub:"\u0639\u0628\u0631 \u0663 \u0628\u064a\u0626\u0627\u062a",
      budgetUtil:"\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", budgetUtilSub:"\u062d\u062f \u0661\u0660\u0660 \u0623\u0644\u0641 \u062f\u0648\u0644\u0627\u0631",
      ytd:"\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0639\u0627\u0645", ytdSub:"\u064a\u0646\u0627\u064a\u0631\u2013\u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664",
      avgDaily:"\u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u064a\u0648\u0645\u064a\u0629", avgDailySub:"\u0645\u062a\u0648\u0633\u0637 \u0663\u0660 \u064a\u0648\u0645\u064b\u0627",
      anomalies:"\u0634\u0630\u0648\u0630\u0630\u0627\u062a \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641", anomaliesSub:"\u0622\u062e\u0631 \u0663\u0660 \u064a\u0648\u0645\u064b\u0627",
      outstanding:"\u0627\u0644\u0645\u0628\u0627\u0644\u063a \u0627\u0644\u0645\u0633\u062a\u062d\u0642\u0629", outstandingSub:"\u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631 \u0645\u062f\u0641\u0648\u0639\u0629",
      lastInvoice:"\u0622\u062e\u0631 \u0641\u0627\u062a\u0648\u0631\u0629", lastInvoiceSub:"\u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664",
      ytdInvoiced:"\u0645\u062c\u0645\u0648\u0639 \u0641\u0648\u0627\u062a\u064a\u0631 \u0627\u0644\u0639\u0627\u0645", ytdInvoicedSub:"\u0661\u0660 \u0641\u0648\u0627\u062a\u064a\u0631",
    },
    charts: {
      monthlyCostTrend:"\u0627\u062a\u062c\u0627\u0647 \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0634\u0647\u0631\u064a\u0629",
      monthlyCostSub:"\u0627\u0644\u0641\u0639\u0644\u064a \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u062a\u0648\u0642\u0639 \u00b7 \u0662\u0660\u0662\u0664",
      serviceBreakdown:"\u062a\u0641\u0635\u064a\u0644 \u0627\u0644\u062e\u062f\u0645\u0627\u062a",
      serviceBreakdownSub:"\u062d\u0633\u0628 \u0627\u0644\u062a\u0643\u0644\u0641\u0629\u060c \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
      actual:"\u0641\u0639\u0644\u064a", forecast:"\u062a\u0648\u0642\u0639",
    },
    tables: {
      topProjects:"\u0623\u0639\u0644\u0649 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0625\u0646\u0641\u0627\u0642\u064b\u0627",
      topProjectsSub:"\u0641\u062a\u0631\u0629 \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629",
      viewAll:"\u0639\u0631\u0636 \u0627\u0644\u0643\u0644", export:"\u062a\u0635\u062f\u064a\u0631", exportCsv:"\u062a\u0635\u062f\u064a\u0631 CSV",
      activeAlerts:"\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629",
      project:"\u0627\u0644\u0645\u0634\u0631\u0648\u0639", environment:"\u0627\u0644\u0628\u064a\u0626\u0629", mtdCost:"\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0634\u0647\u0631",
      budget:"\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", utilization:"\u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645", status:"\u0627\u0644\u062d\u0627\u0644\u0629",
      service:"\u0627\u0644\u062e\u062f\u0645\u0629", cost:"\u0627\u0644\u062a\u0643\u0644\u0641\u0629", pctOfTotal:"% \u0645\u0646 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
      vsLastMonth:"\u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0645\u0627\u0636\u064a", trend:"\u0627\u0644\u0627\u062a\u062c\u0627\u0647",
      regional:"\u0627\u0644\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u062c\u063a\u0631\u0627\u0641\u064a", regionalSub:"\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u062d\u0633\u0628 \u0627\u0644\u0645\u0646\u0637\u0642\u0629",
    },
    badge: { healthy:"\u0637\u0628\u064a\u0639\u064a", warning:"\u062a\u062d\u0630\u064a\u0631", over:"\u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", critical:"\u062d\u0631\u062c", exceeded:"\u062a\u062c\u0627\u0648\u0632", paid:"\u0645\u062f\u0641\u0648\u0639", pending:"\u0645\u0639\u0644\u0642", active:"\u0646\u0634\u0637" },
    env: { Production:"\u0625\u0646\u062a\u0627\u062c", Staging:"\u062a\u062c\u0631\u064a\u0628\u064a", Development:"\u062a\u0637\u0648\u064a\u0631" },
    alerts: [
      { type:"critical", msg:"ml-training-v3 \u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629 \u0628\u0646\u0633\u0628\u0629 \u0661\u0665\u066a\u066a", time:"\u0645\u0646\u0630 \u0633\u0627\u0639\u062a\u064a\u0646" },
      { type:"warning", msg:"Compute Engine \u0648\u0635\u0644 \u0669\u0666\u066a \u0645\u0646 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629 \u0627\u0644\u0634\u0647\u0631\u064a\u0629", time:"\u0645\u0646\u0630 \u0664 \u0633\u0627\u0639\u0627\u062a" },
      { type:"warning", msg:"\u062a\u0643\u0627\u0644\u064a\u0641 BigQuery \u0627\u0631\u062a\u0641\u0639\u062a \u0662\u0668\u066a\u066a \u0645\u0642\u0627\u0631\u0646\u0629\u064b \u0628\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0645\u0627\u0636\u064a", time:"\u0645\u0646\u0630 \u0666 \u0633\u0627\u0639\u0627\u062a" },
      { type:"info", msg:"\u062a\u0642\u0631\u064a\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0664 \u062c\u0627\u0647\u0632 \u0644\u0644\u062a\u0646\u0632\u064a\u0644", time:"\u0645\u0646\u0630 \u064a\u0648\u0645" },
    ],
    invoices: {
      history:"\u0633\u062c\u0644 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631", historySub:"\u062c\u0645\u064a\u0639 \u0641\u062a\u0631\u0627\u062a \u0627\u0644\u0641\u0648\u062a\u0631\u0629",
      downloadAll:"\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0643\u0644",
      invoiceId:"\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629", period:"\u0641\u062a\u0631\u0629 \u0627\u0644\u0641\u0648\u062a\u0631\u0629",
      amount:"\u0627\u0644\u0645\u0628\u0644\u063a", status:"\u0627\u0644\u062d\u0627\u0644\u0629", action:"\u0625\u062c\u0631\u0627\u0621", download:"\u2193 PDF",
    },
    budgets: { overBy:"\u26a0 \u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629 \u0628\u0645\u0642\u062f\u0627\u0631" },
    reports: {
      generate:"\u0625\u0646\u0634\u0627\u0621 \u062a\u0642\u0631\u064a\u0631", generateSub:"\u062a\u0635\u062f\u064a\u0631 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0628\u0635\u064a\u063a \u0645\u062a\u0639\u062f\u062f\u0629",
      scheduled:"\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u0645\u062c\u062f\u0648\u0644\u0629", scheduledSub:"\u0625\u0639\u062f\u0627\u062f \u0627\u0644\u062a\u0633\u0644\u064a\u0645 \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a",
      newSchedule:"+ \u062c\u062f\u0648\u0644\u0629 \u062c\u062f\u064a\u062f\u0629", edit:"\u062a\u0639\u062f\u064a\u0644",
      types:[
        { title:"\u0645\u0644\u062e\u0635 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641", desc:"\u062a\u0641\u0635\u064a\u0644 \u0634\u0647\u0631\u064a \u0644\u0644\u062a\u0643\u0627\u0644\u064a\u0641 \u062d\u0633\u0628 \u0627\u0644\u062e\u062f\u0645\u0629 \u0648\u0627\u0644\u0645\u0634\u0631\u0648\u0639" },
        { title:"\u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0627\u0644\u062a\u0641\u0635\u064a\u0644\u064a\u0629", desc:"\u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 SKU \u0628\u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u0646\u0648\u062f" },
        { title:"\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", desc:"\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629 \u0648\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0648\u0642\u0639\u0627\u062a" },
      ],
      schedules:[
        { name:"\u0645\u0644\u062e\u0635 \u0634\u0647\u0631\u064a \u0644\u0644\u0625\u062f\u0627\u0631\u0629", freq:"\u0623\u0648\u0644 \u0643\u0644 \u0634\u0647\u0631", recipients:"team@company.com", format:"PDF" },
        { name:"\u0645\u0644\u062e\u0635 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064a", freq:"\u0643\u0644 \u0625\u062b\u0646\u064a\u0646", recipients:"devops@company.com", format:"CSV" },
        { name:"\u062a\u0642\u0631\u064a\u0631 \u062a\u0646\u0628\u064a\u0647 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", freq:"\u0639\u0646\u062f \u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u062d\u062f", recipients:"finance@company.com", format:"PDF" },
      ],
    },
    settings: {
      apiKeys:"\u0645\u0641\u0627\u062a\u064a\u062d API", apiKeysSub:"\u0625\u062f\u0627\u0631\u0629 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0639\u062a\u0645\u0627\u062f \u062d\u0633\u0627\u0628 \u0627\u0644\u062e\u062f\u0645\u0629",
      newKey:"+ \u0645\u0641\u062a\u0627\u062d \u062c\u062f\u064a\u062f",
      team:"\u0623\u0639\u0636\u0627\u0621 \u0627\u0644\u0641\u0631\u064a\u0642", teamSub:"\u0663 \u0623\u0639\u0636\u0627\u0621", invite:"\u062f\u0639\u0648\u0629",
      audit:"\u0633\u062c\u0644 \u0627\u0644\u062a\u062f\u0642\u064a\u0642", auditSub:"\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062e\u064a\u0631 \u0644\u0644\u0646\u0638\u0627\u0645",
      created:"\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0625\u0646\u0634\u0627\u0621", lastUsed:"\u0622\u062e\u0631 \u0627\u0633\u062a\u062e\u062f\u0627\u0645",
      appearanceTitle:"\u0627\u0644\u0645\u0638\u0647\u0631 \u0648\u0627\u0644\u0644\u063a\u0629",
      billingAccounts:"\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0641\u0648\u062a\u0631\u0629",
      billingAccountsSub:"\u0625\u062f\u0627\u0631\u0629 \u062d\u0633\u0627\u0628\u0627\u062a GCP",
      addAccount:"+ \u0625\u0636\u0627\u0641\u0629 \u062d\u0633\u0627\u0628",
      keys:[
        { name:"\u062d\u0633\u0627\u0628 \u062e\u062f\u0645\u0629 \u0627\u0644\u0625\u0646\u062a\u0627\u062c", created:"\u0661\u0665 \u064a\u0646\u0627\u064a\u0631 \u0662\u0660\u0662\u0664", last:"\u0645\u0646\u0630 \u0633\u0627\u0639\u062a\u064a\u0646", status:"active" },
        { name:"BigQuery \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637", created:"\u0663 \u0645\u0627\u0631\u0633 \u0662\u0660\u0662\u0664", last:"\u0645\u0646\u0630 \u0665 \u0623\u064a\u0627\u0645", status:"active" },
      ],
      members:[
        { name:"\u0645\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0634\u062f", role:"\u0645\u0627\u0644\u0643", email:"m@company.com" },
        { name:"\u0633\u0627\u0631\u0629 \u062a\u0634\u0646", role:"\u0645\u062f\u064a\u0631", email:"s@company.com" },
        { name:"\u062c\u064a\u0645\u0633 \u0648\u064a\u0644\u0633\u0648\u0646", role:"\u0645\u0634\u0627\u0647\u062f", email:"j@company.com" },
      ],
      logs:[
        { action:"\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u062d\u062f \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", user:"\u0645\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0634\u062f", time:"\u0627\u0644\u064a\u0648\u0645\u060c \u0661\u0664:\u0662\u0663", type:"write" },
        { action:"\u062a\u0645 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0641\u0627\u062a\u0648\u0631\u0629 INV-2024-010", user:"\u0633\u0627\u0631\u0629 \u062a\u0634\u0646", time:"\u0627\u0644\u064a\u0648\u0645\u060c \u0661\u0661:\u0660\u0665", type:"read" },
        { action:"\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0645\u0641\u062a\u0627\u062d API \u062c\u062f\u064a\u062f", user:"\u0645\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0634\u062f", time:"\u0623\u0645\u0633\u060c \u0661\u0666:\u0664\u0660", type:"write" },
        { action:"\u062a\u0645\u062a \u062f\u0639\u0648\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u062c\u064a\u0645\u0633 \u0648\u064a\u0644\u0633\u0648\u0646", user:"\u0645\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0634\u062f", time:"\u0662\u0668 \u0623\u0643\u062a\u0648\u0628\u0631\u060c \u0660\u0669:\u0661\u0665", type:"write" },
        { action:"\u0627\u0643\u062a\u0645\u0644\u062a \u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0641\u0648\u062a\u0631\u0629", user:"\u0627\u0644\u0646\u0638\u0627\u0645", time:"\u0662\u0668 \u0623\u0643\u062a\u0648\u0628\u0631\u060c \u0660\u0660:\u0660\u0660", type:"system" },
      ],
    },
    cmd: {
      placeholder:"\u0627\u0628\u062d\u062b \u0639\u0646 \u0635\u0641\u062d\u0627\u062a \u0648\u0625\u062c\u0631\u0627\u0621\u0627\u062a\u2026",
      items:[
        { label:"\u0644\u0648\u062d\u0629 \u0627\u0644\u0646\u0638\u0631\u0629 \u0627\u0644\u0639\u0627\u0645\u0629", page:"overview", icon:"\u2b21" },
        { label:"\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641", page:"analytics", icon:"\u25c8" },
        { label:"\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639", page:"projects", icon:"\u25eb" },
        { label:"\u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631", page:"invoices", icon:"\u25fb" },
        { label:"\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0627\u062a \u0648\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a", page:"budgets", icon:"\u25d1" },
        { label:"\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631", page:"reports", icon:"\u25e7" },
        { label:"\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a", page:"settings", icon:"\u25ce" },
      ],
    },
    appearance:"\u0627\u0644\u0645\u0638\u0647\u0631", language:"\u0627\u0644\u0644\u063a\u0629",
    darkMode:"\u062f\u0627\u0643\u0646", lightMode:"\u0641\u0627\u062a\u062d",
    notificationsCount:"\u0664 \u0625\u0634\u0639\u0627\u0631\u0627\u062a",
    serviceNames:{ "Compute Engine":"\u0643\u0648\u0645\u0628\u064a\u0648\u062a \u0625\u0646\u062c\u0646","Cloud Storage":"\u0627\u0644\u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0633\u062d\u0627\u0628\u064a","BigQuery":"BigQuery","Cloud SQL":"Cloud SQL","Kubernetes Engine":"\u0643\u0648\u0628\u064a\u0631\u0646\u064a\u062a\u0633","Networking":"\u0627\u0644\u0634\u0628\u0643\u0627\u062a","Other":"\u0623\u062e\u0631\u0649" },
  },
};

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

const AppCtx = createContext({});
const useApp = () => useContext(AppCtx);

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
  {name:"Compute Engine",cost:38420,pct:40.8,change:+12.4,color:"#4F8EF7"},
  {name:"Cloud Storage",cost:18210,pct:19.3,change:+3.1,color:"#34D399"},
  {name:"BigQuery",cost:14890,pct:15.8,change:+28.7,color:"#F59E0B"},
  {name:"Cloud SQL",cost:9340,pct:9.9,change:-2.3,color:"#A78BFA"},
  {name:"Kubernetes Engine",cost:7120,pct:7.6,change:+5.8,color:"#F87171"},
  {name:"Networking",cost:4320,pct:4.6,change:+1.2,color:"#38BDF8"},
  {name:"Other",cost:1900,pct:2.0,change:-0.8,color:"#6B7280"},
];
const PROJECTS=[
  {id:"proj-001",name:"prod-api-cluster",env:"Production",cost:31240,budget:35000,change:+8.2,status:"healthy"},
  {id:"proj-002",name:"ml-training-v3",env:"Production",cost:28910,budget:25000,change:+34.1,status:"over"},
  {id:"proj-003",name:"data-pipeline-eu",env:"Production",cost:14320,budget:20000,change:-3.4,status:"healthy"},
  {id:"proj-004",name:"staging-infra",env:"Staging",cost:9840,budget:12000,change:+2.1,status:"healthy"},
  {id:"proj-005",name:"analytics-bq",env:"Production",cost:7620,budget:8000,change:+22.8,status:"warning"},
  {id:"proj-006",name:"dev-sandbox",env:"Development",cost:2270,budget:5000,change:-12.0,status:"healthy"},
];
const INVOICES_DATA=[
  {id:"INV-2024-010",period:"Oct 2024",amount:94100,status:"paid"},
  {id:"INV-2024-009",period:"Sep 2024",amount:88600,status:"paid"},
  {id:"INV-2024-008",period:"Aug 2024",amount:91200,status:"paid"},
  {id:"INV-2024-007",period:"Jul 2024",amount:82100,status:"paid"},
  {id:"INV-2024-006",period:"Jun 2024",amount:69800,status:"paid"},
];
const BUDGETS_DATA=[
  {name:"Compute Engine",limit:40000,spent:38420,pct:96.1,status:"critical"},
  {name:"ML Training",limit:25000,spent:28910,pct:115.6,status:"exceeded"},
  {name:"Data Pipeline",limit:20000,spent:14320,pct:71.6,status:"healthy"},
  {name:"Total Monthly",limit:100000,spent:94100,pct:94.1,status:"warning"},
];
const REGIONS=[
  {name:"us-central1",cost:42100,pct:44.7},
  {name:"europe-west1",cost:21300,pct:22.6},
  {name:"us-east1",cost:14800,pct:15.7},
  {name:"asia-east1",cost:9200,pct:9.8},
  {name:"us-west2",cost:6700,pct:7.2},
];
const NAV_ICONS={overview:"\u2b21",analytics:"\u25c8",projects:"\u25eb",invoices:"\u25fb",budgets:"\u25d1",reports:"\u25e7",settings:"\u25ce"};

const fmt=(n)=>n>=1000?`$${(n/1000).toFixed(1)}K`:`$${n}`;
const fmtFull=(n)=>`$${n.toLocaleString()}`;

function SegmentControl({options,value,onChange}){const{T}=useApp();return(<div style={{display:"flex",alignItems:"center",gap:3,background:T.toggleBg,border:`1px solid ${T.toggleBorder}`,borderRadius:10,padding:3}}>{options.map(opt=>{const active=value===opt.val;return(<button key={String(opt.val)} onClick={()=>onChange(opt.val)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:7,border:"none",cursor:"pointer",background:active?T.toggleActiveBg:"transparent",color:active?T.text:T.textMuted,fontSize:12,fontWeight:active?600:500,transition:"all 0.15s"}}><span style={{fontSize:13}}>{opt.icon}</span>{opt.label}</button>);})}</div>);}

function Badge({status}){const{t}=useApp();const map={healthy:{bg:"rgba(52,211,153,0.12)",color:"#34D399"},warning:{bg:"rgba(245,158,11,0.12)",color:"#F59E0B"},over:{bg:"rgba(248,113,113,0.12)",color:"#F87171"},critical:{bg:"rgba(248,113,113,0.12)",color:"#F87171"},exceeded:{bg:"rgba(239,68,68,0.15)",color:"#EF4444"},paid:{bg:"rgba(52,211,153,0.12)",color:"#34D399"},pending:{bg:"rgba(245,158,11,0.12)",color:"#F59E0B"},active:{bg:"rgba(52,211,153,0.12)",color:"#34D399"}};const s=map[status]||map.healthy;return(<span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:600,letterSpacing:"0.04em",padding:"3px 10px",borderRadius:20}}>{t.badge[status]||status}</span>);}

function Change({v}){const up=v>=0;return<span style={{color:up?"#F87171":"#34D399",fontSize:12,fontWeight:600}}>{up?"↑":"↓"} {Math.abs(v)}%</span>;}

function AlertDot({type}){return<span style={{width:7,height:7,borderRadius:"50%",background:{critical:"#EF4444",warning:"#F59E0B",info:"#4F8EF7"}[type]||"#6B7280",display:"inline-block",flexShrink:0,marginTop:5}}/>;}

function EnvBadge({env}){const{T,t}=useApp();const s=env==="Production"?{bg:T.envProdBg,color:T.envProdColor}:env==="Staging"?{bg:T.envStagBg,color:T.envStagColor}:{bg:T.envDevBg,color:T.envDevColor};return<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:s.bg,color:s.color}}>{t.env[env]||env}</span>;}

function SparkLine({data,color="#4F8EF7",h=40,w=120}){const max=Math.max(...data),min=Math.min(...data);const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/(max-min||1))*h}`).join(" ");const area=`0,${h} ${pts} ${w},${h}`;const gid=`sg${color.replace("#","")}`;return(<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}><defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs><polygon points={area} fill={`url(#${gid})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);}

function BarChart({data}){const{T}=useApp();const max=Math.max(...data.map(d=>Math.max(d.cost||0,d.forecast||0)));const W=680,H=200,BAR_W=28,GAP=(W-data.length*BAR_W)/data.length;return(<svg width="100%" viewBox={`0 0 ${W} ${H+30}`} style={{overflow:"visible"}}><defs><linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F8EF7" stopOpacity="0.9"/><stop offset="100%" stopColor="#4F8EF7" stopOpacity="0.3"/></linearGradient><linearGradient id="fcG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2"/></linearGradient></defs>{[0,.25,.5,.75,1].map((tick,i)=>(<g key={i}><line x1={0} y1={H-H*tick} x2={W} y2={H-H*tick} stroke={T.gridLine} strokeWidth={1}/><text x={-8} y={H-H*tick+4} fill={T.textLabel} fontSize={10} textAnchor="end">{fmt(max*tick)}</text></g>))}{data.map((d,i)=>{const x=i*(BAR_W+GAP)+GAP/2,val=d.cost||d.forecast||0,bh=(val/max)*H,isFc=d.forecast!=null;return(<g key={i}><rect x={x} y={H-bh} width={BAR_W} height={bh} fill={isFc?"url(#fcG)":"url(#barG)"} rx={4} opacity={isFc?.7:1} style={{filter:isFc?"none":"drop-shadow(0 2px 8px rgba(79,142,247,0.3))"}}/>{isFc&&<rect x={x} y={H-bh} width={BAR_W} height={bh} rx={4} fill="none" stroke="#A78BFA" strokeWidth={1} strokeDasharray="3,2" opacity={.6}/>}<text x={x+BAR_W/2} y={H+18} fill={T.textLabel} fontSize={10} textAnchor="middle">{d.month}</text></g>);})}</svg>);}

function DonutChart({data,size=160}){const{t,T}=useApp();const r=size/2-16,cx=size/2,cy=size/2;const total=data.reduce((s,d)=>s+d.cost,0);let cum=-Math.PI/2;const slices=data.map(d=>{const angle=(d.cost/total)*2*Math.PI,sa=cum;cum+=angle;return{...d,sa,ea:cum}});const arc=(sa,ea,ri=r,ro=r+14)=>{const x1o=cx+ro*Math.cos(sa),y1o=cy+ro*Math.sin(sa);const x2o=cx+ro*Math.cos(ea),y2o=cy+ro*Math.sin(ea);const x1i=cx+ri*Math.cos(ea),y1i=cy+ri*Math.sin(ea);const x2i=cx+ri*Math.cos(sa),y2i=cy+ri*Math.sin(sa);const lg=ea-sa>Math.PI?1:0;return`M${x1o},${y1o} A${ro},${ro} 0 ${lg} 1 ${x2o},${y2o} L${x1i},${y1i} A${ri},${ri} 0 ${lg} 0 ${x2i},${y2i} Z`;};return(<svg width={size} height={size}>{slices.map((s,i)=>(<path key={i} d={arc(s.sa,s.ea)} fill={s.color} opacity={0.9} style={{filter:`drop-shadow(0 2px 6px ${s.color}40)`}}/>))}<circle cx={cx} cy={cy} r={r-2} fill={T.donutInner}/><text x={cx} y={cy-8} textAnchor="middle" fill={T.text} fontSize={18} fontWeight="700">{fmt(total)}</text><text x={cx} y={cy+12} textAnchor="middle" fill={T.textSub} fontSize={10}>{t.thisMonth}</text></svg>);}

function KPICard({label,value,sub,change,spark,accent="#4F8EF7"}){const{t,T}=useApp();return(<div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"20px 24px",display:"flex",flexDirection:"column",gap:12,position:"relative",overflow:"hidden",boxShadow:T===LIGHT?"0 1px 4px rgba(0,0,0,0.06)":"none"}}><div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accent}60,transparent)`}}/><div style={{fontSize:12,color:T.textSub,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</div><div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}><div><div style={{fontSize:28,fontWeight:700,color:T.text,lineHeight:1,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>{value}</div>{sub&&<div style={{fontSize:12,color:T.textMuted,marginTop:6}}>{sub}</div>}{change!==undefined&&<div style={{marginTop:8}}><Change v={change}/> <span style={{fontSize:11,color:T.textMuted}}>{t.vsLastMonth}</span></div>}</div>{spark&&<SparkLine data={spark} color={accent}/>}</div></div>);}

function Card({children,style={}}){const{T}=useApp();return(<div style={{background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:24,boxShadow:T===LIGHT?"0 1px 4px rgba(0,0,0,0.06)":"none",...style}}>{children}</div>);}

function SectionHeader({title,sub,action}){const{T}=useApp();return(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><div style={{fontSize:16,fontWeight:700,color:T.text,letterSpacing:"-0.01em"}}>{title}</div>{sub&&<div style={{fontSize:12,color:T.textSub,marginTop:2}}>{sub}</div>}</div>{action&&<button style={{fontSize:12,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:500}}>{action}</button>}</div>);}


function SettingsPage(){const{t,T,dark,setDark,lang,setLang}=useApp();const themeOpts=[{val:false,icon:"☀",label:t.lightMode},{val:true,icon:"🌙",label:t.darkMode}];const langOpts=[{val:"en",icon:"🇺🇸",label:"English"},{val:"ar",icon:"🇸🇦",label:"العربية"}];
const[keys,setKeys]=useState([]);const[team,setTeam]=useState([]);const[auditLogs,setAuditLogs]=useState([]);const[billingAccounts,setBillingAccounts]=useState([]);const[newKeyName,setNewKeyName]=useState('');const[showNewKey,setShowNewKey]=useState(false);const[newKeyValue,setNewKeyValue]=useState('');const[newAccName,setNewAccName]=useState('');const[newAccId,setNewAccId]=useState('');const[showNewAccount,setShowNewAccount]=useState(false);
useEffect(()=>{Promise.all([apiKeysApi.list().catch(()=>({keys:[]})),authApi.users().catch(()=>({users:[]})),gcpApi.auditLog().catch(()=>({logs:[]})),gcpApi.billingAccounts.list().catch(()=>({accounts:[]}))]).then(([k,u,a,b])=>{setKeys(k.keys||[]);setTeam(u.users||[]);setAuditLogs(a.logs||[]);setBillingAccounts(b.accounts||[]);});},[]);
const createKey=async()=>{if(!newKeyName)return;try{const r=await apiKeysApi.create(newKeyName);setNewKeyValue(r.key);setKeys(prev=>[...prev,{id:r.id,name:r.name,status:'active',created_at:new Date().toISOString()}]);setNewKeyName('');}catch{}};
const deleteKey=async(id)=>{if(!confirm('Delete this API key?'))return;try{await apiKeysApi.delete(id);setKeys(prev=>prev.filter(k=>k.id!==id));}catch{}};
const addBillingAccount=async()=>{if(!newAccName||!newAccId)return;try{await gcpApi.billingAccounts.create(newAccName,newAccId);setBillingAccounts(prev=>[...prev,{name:newAccName,account_id:newAccId,status:'active'}]);setNewAccName('');setNewAccId('');setShowNewAccount(false);}catch{}};
const deleteBillingAccount=async(id)=>{if(!confirm('Remove this billing account?'))return;try{await gcpApi.billingAccounts.delete(id);setBillingAccounts(prev=>prev.filter(a=>a.id!==id));}catch{}};
return(<div style={{display:"flex",flexDirection:"column",gap:24}}>
<Card><SectionHeader title={t.settings.appearanceTitle}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}><div><div style={{fontSize:12,color:T.textSub,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12}}>{t.appearance}</div><SegmentControl options={themeOpts} value={dark} onChange={setDark}/></div><div><div style={{fontSize:12,color:T.textSub,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12}}>{t.language}</div><SegmentControl options={langOpts} value={lang} onChange={setLang}/></div></div></Card>

<Card><SectionHeader title={t.settings.billingAccounts} sub={t.settings.billingAccountsSub} action={<span onClick={()=>setShowNewAccount(true)}>{t.settings.addAccount}</span>}/>
{showNewAccount&&(<div style={{marginBottom:16,padding:12,background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10,display:'flex',flexDirection:'column',gap:8}}><input value={newAccName} onChange={e=>setNewAccName(e.target.value)} placeholder="Account name..." style={{padding:'8px 12px',background:T.card,border:`1px solid ${T.inputBorder}`,borderRadius:8,color:T.text,fontSize:13,outline:'none'}}/><input value={newAccId} onChange={e=>setNewAccId(e.target.value)} placeholder="GCP Billing Account ID (XXXXXX-XXXXXX-XXXXXX)" style={{padding:'8px 12px',background:T.card,border:`1px solid ${T.inputBorder}`,borderRadius:8,color:T.text,fontSize:13,outline:'none'}}/><div style={{display:'flex',gap:8}}><button onClick={addBillingAccount} style={{padding:'8px 16px',background:'#4F8EF7',border:'none',borderRadius:8,color:'white',fontSize:13,fontWeight:600,cursor:'pointer'}}>Add</button><button onClick={()=>setShowNewAccount(false)} style={{padding:'8px',background:'transparent',border:`1px solid ${T.cardBorder}`,borderRadius:8,color:T.textSub,fontSize:13,cursor:'pointer'}}>Cancel</button></div></div>)}
{billingAccounts.map((a,i)=>(<div key={a.id||i} style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.name}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2,fontFamily:"'DM Mono',monospace"}}>{a.account_id}</div></div><div style={{display:'flex',gap:8,alignItems:'center'}}>{a.is_default?<span style={{fontSize:10,color:'#34D399',fontWeight:600,background:'rgba(52,211,153,0.12)',padding:'2px 8px',borderRadius:10}}>Default</span>:null}<button onClick={()=>deleteBillingAccount(a.id)} style={{fontSize:11,color:'#F87171',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontWeight:500}}>Remove</button></div></div>))}</Card>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Card><SectionHeader title={t.settings.apiKeys} sub={t.settings.apiKeysSub} action={<span onClick={()=>setShowNewKey(true)}>{t.settings.newKey}</span>}/>
{showNewKey&&(<div style={{marginBottom:16,padding:12,background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10}}>{newKeyValue?(<div><div style={{fontSize:12,color:T.textSub,marginBottom:8}}>⚠️ Copy this key now!</div><div style={{fontSize:12,fontFamily:"'DM Mono',monospace",background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:8,padding:12,wordBreak:'break-all',color:T.text}}>{newKeyValue}</div><button onClick={()=>{setShowNewKey(false);setNewKeyValue('');}} style={{marginTop:8,fontSize:12,color:"#4F8EF7",background:"transparent",border:"none",cursor:"pointer"}}>Done</button></div>):(<div style={{display:'flex',gap:8}}><input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="Key name..." style={{flex:1,padding:'8px 12px',background:T.card,border:`1px solid ${T.inputBorder}`,borderRadius:8,color:T.text,fontSize:13,outline:'none'}}/><button onClick={createKey} style={{padding:'8px 16px',background:'#4F8EF7',border:'none',borderRadius:8,color:'white',fontSize:13,fontWeight:600,cursor:'pointer'}}>Create</button><button onClick={()=>setShowNewKey(false)} style={{padding:'8px',background:'transparent',border:`1px solid ${T.cardBorder}`,borderRadius:8,color:T.textSub,fontSize:13,cursor:'pointer'}}>✕</button></div>)}</div>)}
{keys.length===0&&<div style={{fontSize:12,color:T.textMuted,padding:'20px 0',textAlign:'center'}}>No API keys yet</div>}
{keys.map((k,i)=>(<div key={k.id||i} style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{k.name}</div><div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{t.settings.created} {k.created_at?new Date(k.created_at).toLocaleDateString():k.created||'-'} · {t.settings.lastUsed} {k.last_used?new Date(k.last_used).toLocaleString():k.last||'never'}</div></div><div style={{display:'flex',alignItems:'center',gap:8}}><Badge status={k.status}/><button onClick={()=>deleteKey(k.id)} style={{fontSize:11,color:'#F87171',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontWeight:500}}>Delete</button></div></div></div>))}</Card>
<Card><SectionHeader title={t.settings.team} sub={`${team.length} members`}/>{team.length===0&&<div style={{fontSize:12,color:T.textMuted,padding:'20px 0',textAlign:'center'}}>No team members</div>}{team.map((u,i)=>(<div key={u.id||i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{width:36,height:36,borderRadius:"50%",background:`hsl(${i*80+200},65%,42%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white",flexShrink:0}}>{(u.name||'U')[0]}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{u.name}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{u.email}</div></div><span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:T.toggleBg,color:T.textSub,fontWeight:600}}>{u.role}</span></div>))}</Card></div>

<Card><SectionHeader title={t.settings.audit} sub={t.settings.auditSub}/>{auditLogs.map((log,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{width:8,height:8,borderRadius:"50%",background:(log.type||'write')==="write"?"#F59E0B":log.type==="system"?"#4F8EF7":"#34D399"}}/><div style={{fontSize:13,color:T.textSub}}>{log.action}</div><div style={{fontSize:12,color:T.textMuted}}>{log.user||'-'}</div><div style={{fontSize:11,color:T.textMuted}}>{log.time?new Date(log.time).toLocaleString():log.time||''}</div></div>))}</Card></div>);}

function CommandPalette({onClose,onNav}){const{t,T}=useApp();const[q,setQ]=useState("");const items=t.cmd.items.filter(i=>i.label.includes(q)||i.label.toLowerCase().includes(q.toLowerCase()));return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:120}} onClick={onClose}><div style={{background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:16,width:560,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 20px",borderBottom:`1px solid ${T.tableRowBorder}`}}><span style={{fontSize:16,color:T.textMuted}}>⌕</span><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={t.cmd.placeholder} style={{flex:1,background:"none",border:"none",outline:"none",fontSize:15,color:T.text,fontFamily:"inherit"}}/><kbd style={{fontSize:11,color:T.textMuted,background:T.kbdBg,border:`1px solid ${T.kbdBorder}`,borderRadius:6,padding:"2px 7px"}}>ESC</kbd></div><div style={{padding:8,maxHeight:360,overflowY:"auto"}}>{items.map(item=>(<div key={item.page} onClick={()=>{onNav(item.page);onClose();}} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:10,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{fontSize:14,color:T.textMuted}}>{item.icon}</span><span style={{fontSize:14,color:T.textSub}}>{item.label}</span></div>))}</div></div></div>);}

const PAGE_MAP={overview:OverviewPage,analytics:AnalyticsPage,projects:ProjectsPage,invoices:InvoicesPage,budgets:BudgetsPage,reports:ReportsPage,settings:SettingsPage};

export default function App(){
  const{user,logout}=useAuth();
  const[dark,setDark]=useState(true);
  const[lang,setLang]=useState("en");
  const[page,setPage]=useState("overview");
  const[showCmd,setShowCmd]=useState(false);
  const[showUserMenu,setShowUserMenu]=useState(false);const[showNotif,setShowNotif]=useState(false);
  const[billingAccounts,setBillingAccounts]=useState([]);
  const[dateStart,setDateStart]=useState(()=>{const d=new Date();d.setDate(1);return d;});
  const[dateEnd,setDateEnd]=useState(()=>new Date());
  const[showDatePicker,setShowDatePicker]=useState(false);
  const[activeAccount,setActiveAccount]=useState(null);
  const[showAccountPicker,setShowAccountPicker]=useState(false);

  useEffect(()=>{gcpApi.billingAccounts.list().then(res=>{setBillingAccounts(res.accounts);const def=res.accounts.find(a=>a.is_default)||res.accounts[0];if(def)setActiveAccount(def);}).catch(()=>{});},[]);

  const switchAccount=(acc)=>{setActiveAccount(acc);setShowAccountPicker(false);};

  const T=dark?DARK:LIGHT;
  const t=TRANSLATIONS[lang];
  const isRTL=t.dir==="rtl";

  useEffect(()=>{const handler=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setShowCmd(v=>!v);}if(e.key==="Escape")setShowCmd(false);};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[]);

  const PageComponent=PAGE_MAP[page]||OverviewPage;
  const navItems=Object.entries(t.nav).map(([id,label])=>({id,label,icon:NAV_ICONS[id]}));
  const themeOpts=[{val:false,icon:"☀",label:t.lightMode},{val:true,icon:"🌙",label:t.darkMode}];
  const langOpts=[{val:"en",icon:"🇺🇸",label:"EN"},{val:"ar",icon:"🇸🇦",label:"AR"}];
  const fontFamily=isRTL?"'Tajawal','DM Sans',sans-serif":"'DM Sans',sans-serif";

  return(
    <AppCtx.Provider value={{dark,setDark,lang,setLang,t,T,activeAccount,dateStart,dateEnd}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600&family=Tajawal:wght@400;500;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html{font-family:${fontFamily};background:${T.bg};}body{font-family:${fontFamily};background:${T.bg};color:${T.text};transition:background 0.2s,color 0.2s;-webkit-font-smoothing:antialiased;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${T.scrollbar};border-radius:4px;}input,button,kbd{font-family:${fontFamily};}`}</style>
      {showCmd&&<CommandPalette onClose={()=>setShowCmd(false)} onNav={setPage}/>}
      <div dir={t.dir} style={{display:"flex",minHeight:"100vh",flexDirection:isRTL?"row-reverse":"row",background:T.bgGrad,transition:"background 0.2s"}}>
        <aside style={{width:236,flexShrink:0,background:T.sidebar,borderInlineEnd:`1px solid ${T.sidebarBorder}`,display:"flex",flexDirection:"column",padding:"24px 0",position:"sticky",top:0,height:"100vh",transition:"background 0.2s"}}>
          <div style={{padding:"0 20px 28px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src={dark?"/logo-white.jpg":"/logo-black.jpg"} alt="CntxtLens" style={{width:42,height:42,borderRadius:10,objectFit:'contain',flexShrink:0,background:'rgba(255,255,255,0.1)',padding:4}}/>
              <div><div style={{fontSize:15,fontWeight:800,color:T.text}}>{t.appName}</div><div style={{fontSize:11,color:T.textMuted,fontWeight:600,letterSpacing:'0.04em'}}>{t.appSub}</div></div>
            </div>
          </div>

          <div style={{margin:"0 12px 20px",position:'relative'}}>
            <div onClick={()=>setShowAccountPicker(v=>!v)} style={{padding:"10px 12px",background:T.orgBg,borderRadius:10,border:`1px solid ${T.orgBorder}`,cursor:"pointer"}}>
              <div style={{fontSize:11,color:T.textMuted,marginBottom:2}}>{t.billingAccount}</div>
              <div style={{fontSize:13,fontWeight:600,color:T.text,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:160}}>{activeAccount?activeAccount.name:'Loading...'}</span>
                <span style={{color:T.textMuted,fontSize:10}}>⌄</span>
              </div>
            </div>
            {showAccountPicker&&(
              <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:4,background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:12,overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,0.4)',zIndex:200}}>
                {billingAccounts.map(acc=>(
                  <div key={acc.id} onClick={()=>switchAccount(acc)} style={{padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',background:activeAccount?.id===acc.id?T.activeNavBg:'transparent',borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.text}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg} onMouseLeave={e=>{if(activeAccount?.id!==acc.id)e.currentTarget.style.background='transparent';}}>
                    <div><div style={{fontWeight:600}}>{acc.name}</div><div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{acc.account_id}</div></div>
                    {acc.is_default?<span style={{fontSize:9,color:'#34D399',fontWeight:600,background:'rgba(52,211,153,0.12)',padding:'2px 8px',borderRadius:10}}>Default</span>:null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <nav style={{flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2}}>
            {navItems.map(item=>{const active=page===item.id;return(<button key={item.id} onClick={()=>setPage(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,background:active?T.activeNavBg:"transparent",border:active?`1px solid ${T.activeNavBorder}`:"1px solid transparent",color:active?T.activeNavColor:T.inactiveNavColor,fontSize:13,fontWeight:active?600:500,cursor:"pointer",width:"100%",textAlign:isRTL?"right":"left",flexDirection:isRTL?"row-reverse":"row",transition:"all 0.12s"}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.hoverBg;}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}><span style={{fontSize:14}}>{item.icon}</span>{item.label}</button>);})}
          </nav>

          <div style={{padding:"16px 12px",borderTop:`1px solid ${T.sidebarBorder}`,marginTop:8,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}><SegmentControl options={themeOpts} value={dark} onChange={setDark}/><SegmentControl options={langOpts} value={lang} onChange={setLang}/></div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 4px"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#34D399",boxShadow:"0 0 8px #34D39980",flexShrink:0}}/><span style={{fontSize:11,color:T.textMuted}}>{t.liveSyncAgo}</span></div>
            <button onClick={()=>setShowCmd(true)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",color:T.textMuted,fontSize:12,flexDirection:isRTL?"row-reverse":"row"}}><span>⌕ {t.search}</span><kbd style={{fontSize:10,background:T.kbdBg,border:`1px solid ${T.kbdBorder}`,borderRadius:4,padding:"1px 5px",color:T.textMuted}}>⌘K</kbd></button>
          </div>
        </aside>

        <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"auto",minWidth:0}}>
          <header style={{position:"sticky",top:0,zIndex:100,background:T.headerBg,backdropFilter:"blur(20px) saturate(180%)",borderBottom:`1px solid ${T.headerBorder}`,padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",flexDirection:isRTL?"row-reverse":"row"}}>
            <h1 style={{fontSize:16,fontWeight:700,color:T.text}}>{t.nav[page]}</h1>
            <div style={{display:"flex",alignItems:"center",gap:12,flexDirection:isRTL?"row-reverse":"row"}}>
              <div style={{position:'relative'}}>
                <div onClick={()=>setShowDatePicker(v=>!v)} style={{background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10,padding:"6px 14px",fontSize:12,color:T.textSub,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                  <span>📅</span>
                  {dateStart.toLocaleDateString(lang==='ar'?'ar-SA':'en-US',{month:'short',day:'numeric'})} – {dateEnd.toLocaleDateString(lang==='ar'?'ar-SA':'en-US',{month:'short',day:'numeric',year:'numeric'})}
                  <span style={{color:T.textMuted,fontSize:10}}>⌄</span>
                </div>
                {showDatePicker&&(
                  <div style={{position:'absolute',top:'100%',right:0,marginTop:4,background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:12,overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,0.4)',zIndex:200,width:280,padding:16}}>
                    <div style={{fontSize:12,color:T.textSub,fontWeight:600,marginBottom:12}}>Select Date Range</div>
                    <div style={{display:'flex',gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>From</div>
                        <input type="date" value={dateStart.toISOString().split('T')[0]} onChange={e=>{setDateStart(new Date(e.target.value+'T00:00:00'));}}
                          style={{width:'100%',padding:'8px',background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:8,color:T.text,fontSize:12,outline:'none'}}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:T.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>To</div>
                        <input type="date" value={dateEnd.toISOString().split('T')[0]} onChange={e=>{setDateEnd(new Date(e.target.value+'T00:00:00'));}}
                          style={{width:'100%',padding:'8px',background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:8,color:T.text,fontSize:12,outline:'none'}}/>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:12}}>
                      {[{label:'7D',days:7},{label:'30D',days:30},{label:'90D',days:90},{label:'1Y',days:365}].map(p=>(
                        <button key={p.label} onClick={()=>{const e=new Date();const s=new Date();s.setDate(s.getDate()-p.days);setDateEnd(e);setDateStart(s);setShowDatePicker(false);}}
                          style={{flex:1,padding:'6px',background:T.toggleBg,border:`1px solid ${T.toggleBorder}`,borderRadius:6,color:T.textSub,fontSize:11,cursor:'pointer',fontWeight:600}}>{p.label}</button>
                      ))}
                    </div>
                    <button onClick={()=>setShowDatePicker(false)} style={{width:'100%',marginTop:10,padding:'8px',background:'#4F8EF7',border:'none',borderRadius:8,color:'white',fontSize:12,fontWeight:600,cursor:'pointer'}}>Apply</button>
                  </div>
                )}
              </div>
              <div style={{position:'relative'}}>
                <div onClick={()=>setShowNotif(v=>!v)} style={{width:36,height:36,borderRadius:10,background:T.inputBg,border:`1px solid ${T.inputBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:'pointer'}}>🔔</div>
                <div style={{position:"absolute",top:7,right:7,width:8,height:8,borderRadius:"50%",background:"#F87171",border:`2px solid ${T.notifDotBg}`}}/>
                {showNotif&&(
                  <div style={{position:'absolute',top:'100%',right:0,marginTop:8,background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:12,overflow:'hidden',minWidth:320,boxShadow:'0 12px 40px rgba(0,0,0,0.4)',zIndex:200}}>
                    <div style={{padding:'14px 18px',borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,fontWeight:600,color:T.text}}>{t.notificationsCount}</div>
                    {t.alerts.map((a,i)=>(
                      <div key={i} style={{display:'flex',gap:12,padding:'12px 18px',borderBottom:`1px solid ${T.tableRowBorder}`,cursor:'pointer'}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <AlertDot type={a.type}/>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{a.msg}</div>
                          <div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{padding:'10px 18px',textAlign:'center',fontSize:11,color:'#4F8EF7',cursor:'pointer'}}
                      onClick={()=>{setShowNotif(false);setPage('overview');}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      View all alerts →
                    </div>
                  </div>
                )}
              </div>
              <div style={{position:'relative'}}>
                <div onClick={()=>setShowUserMenu(v=>!v)} style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#4F8EF7,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",cursor:"pointer"}}>{user?.name?.[0]||'U'}</div>
                {showUserMenu&&(<div style={{position:'absolute',top:'100%',right:0,marginTop:8,background:T.cmdBg,border:`1px solid ${T.cmdBorder}`,borderRadius:12,overflow:'hidden',minWidth:200,boxShadow:'0 12px 40px rgba(0,0,0,0.4)',zIndex:200}}><div style={{padding:'12px 16px',borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{user?.name}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{user?.email}</div><div style={{fontSize:10,color:T.textMuted,marginTop:2,textTransform:'uppercase',letterSpacing:'0.06em'}}>{user?.role}</div></div><button onClick={()=>{logout();setShowUserMenu(false);}} style={{width:'100%',padding:'10px 16px',background:'transparent',border:'none',color:'#F87171',fontSize:13,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:8}} onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>🚪 Sign Out</button></div>)}
              </div>
            </div>
          </header>
          <div style={{flex:1,padding:32}}><PageComponent/></div>
        </main>
      </div>
    </AppCtx.Provider>
  );
}
function OverviewPage(){const{t,T}=useApp();const{activeAccount,dateStart,dateEnd}=useApp()
const[data,setData]=useState({monthly:MONTHLY_COST,services:SERVICES,projects:PROJECTS})
const[loading,setLoading]=useState(true)
useEffect(()=>{const id=activeAccount?.id;const ds=dateStart?.toISOString();const de=dateEnd?.toISOString();setLoading(true);Promise.all([gcpApi.costData(id,ds,de).catch(()=>({monthlyCost:MONTHLY_COST,services:SERVICES})),gcpApi.projects(id).catch(()=>({projects:PROJECTS}))]).then(([c,p])=>{setData({monthly:c.monthlyCost||MONTHLY_COST,services:c.services||SERVICES,projects:p.projects||PROJECTS});setLoading(false)}).catch(()=>setLoading(false))},[activeAccount?.id,dateStart,dateEnd])
const spark=DAILY.slice(-14);const{m,sv,pr}=data;return(<div style={{display:"flex",flexDirection:"column",gap:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}><KPICard label={t.kpi.mtd} value="$94,100" sub={t.kpi.mtdSub} change={+6.2} spark={spark} accent="#4F8EF7"/><KPICard label={t.kpi.projected} value="$98,400" sub={t.kpi.projectedSub} change={+4.6} spark={spark.map(v=>v*1.05)} accent="#A78BFA"/><KPICard label={t.kpi.activeProjects} value="6" sub={t.kpi.activeProjectsSub} accent="#34D399"/><KPICard label={t.kpi.budgetUtil} value="94.1%" sub={t.kpi.budgetUtilSub} change={+6.2} spark={[72,75,78,80,82,85,88,90,91,93,94,94]} accent="#F59E0B"/></div><div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}><Card><SectionHeader title={t.charts.monthlyCostTrend} sub={t.charts.monthlyCostSub} action={t.tables.export}/><div style={{overflowX:"auto"}}><BarChart data={data.monthly}/></div><div style={{display:"flex",gap:20,marginTop:16}}>{[{color:"#4F8EF7",label:t.charts.actual},{color:"#A78BFA",label:t.charts.forecast}].map(l=>(<div key={l.label} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:12,height:12,borderRadius:3,background:l.color}}/><span style={{fontSize:12,color:T.textSub}}>{l.label}</span></div>))}</div></Card><Card><SectionHeader title={t.charts.serviceBreakdown} sub={t.charts.serviceBreakdownSub}/><div style={{display:"flex",justifyContent:"center",marginBottom:20}}><DonutChart data={data.services} size={180}/></div><div style={{display:"flex",flexDirection:"column",gap:10}}>{data.services.slice(0,5).map(s=>(<div key={s.name} style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/><span style={{fontSize:12,color:T.textSub,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.serviceNames[s.name]||s.name}</span><span style={{fontSize:12,fontWeight:600,color:T.text,fontFamily:"'DM Mono',monospace"}}>{s.pct}%</span></div>))}</div></Card></div><div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}><Card><SectionHeader title={t.tables.topProjects} sub={t.tables.topProjectsSub} action={t.tables.viewAll}/>{data.projects.map(p=>(<div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.name}</div><div style={{marginTop:4}}><EnvBadge env={p.env}/></div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.cost)}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>/ {fmtFull(p.budget)}</div></div><Change v={p.change}/><Badge status={p.status}/></div>))}</Card><Card><SectionHeader title={t.tables.activeAlerts} sub={t.notificationsCount}/><div style={{display:"flex",flexDirection:"column",gap:14}}>{t.alerts.map((a,i)=>(<div key={i} style={{display:"flex",gap:10}}><AlertDot type={a.type}/><div><div style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{a.msg}</div><div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{a.time}</div></div></div>))}</div></Card></div></div>);}

function AnalyticsPage(){const{t,T}=useApp();const{activeAccount,dateStart,dateEnd}=useApp()
const[services,setServices]=useState(SERVICES);const[loading,setLoading]=useState(true)
useEffect(()=>{const id=activeAccount?.id;const ds=dateStart?.toISOString();const de=dateEnd?.toISOString();gcpApi.costData(id,ds,de).then(c=>setServices(c.services||SERVICES)).catch(()=>{}).finally(()=>setLoading(false))},[activeAccount?.id,dateStart,dateEnd])
const spark=DAILY.slice(-14);return(<div style={{display:"flex",flexDirection:"column",gap:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}><KPICard label={t.kpi.ytd} value="$720,800" sub={t.kpi.ytdSub} change={+18.4} spark={MONTHLY_COST.filter(d=>d.cost).map(d=>d.cost)} accent="#4F8EF7"/><KPICard label={t.kpi.avgDaily} value="$3,137" sub={t.kpi.avgDailySub} change={+6.2} spark={spark} accent="#34D399"/><KPICard label={t.kpi.anomalies} value="3" sub={t.kpi.anomaliesSub} accent="#F87171"/></div><Card><SectionHeader title={t.charts.serviceBreakdown} sub={`${t.charts.serviceBreakdownSub}`} action={t.tables.exportCsv}/><div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:"0 24px"}}>{[t.tables.service,t.tables.cost,t.tables.pctOfTotal,t.tables.vsLastMonth,t.tables.trend].map(h=>(<div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 12px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>))}{services.map(s=>(<div key={s.name} style={{display:"contents"}}><div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`,display:"flex",alignItems:"center",gap:10}}><div style={{width:10,height:10,borderRadius:"50%",background:s.color}}/><span style={{fontSize:13,color:T.text,fontWeight:500}}>{t.serviceNames[s.name]||s.name}</span></div><div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(s.cost)}</div><div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{height:6,borderRadius:3,background:T.progressTrack,overflow:"hidden",width:100}}><div style={{height:"100%",width:`${s.pct}%`,background:s.color,borderRadius:3}}/></div><div style={{fontSize:11,color:T.textSub,marginTop:4}}>{s.pct}%</div></div><div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Change v={s.change}/></div><div style={{padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><SparkLine data={DAILY.slice(-10).map(v=>v*(s.pct/100))} color={s.color} w={80} h={28}/></div></div>))}</div></Card><Card><SectionHeader title={t.tables.regional} sub={t.tables.regionalSub}/><div style={{display:"flex",flexDirection:"column",gap:14}}>{REGIONS.map(r=>(<div key={r.name} style={{display:"grid",gridTemplateColumns:"140px 1fr 80px 60px",alignItems:"center",gap:16}}><span style={{fontSize:12,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{r.name}</span><div style={{height:8,borderRadius:4,background:T.progressTrack,overflow:"hidden"}}><div style={{height:"100%",width:`${r.pct}%`,background:"linear-gradient(90deg,#4F8EF7,#A78BFA)",borderRadius:4}}/></div><span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace",textAlign:"right"}}>{fmt(r.cost)}</span><span style={{fontSize:12,color:T.textMuted,textAlign:"right"}}>{r.pct}%</span></div>))}</div></Card></div>);}

function ProjectsPage(){const{t,T}=useApp();const{activeAccount,dateStart,dateEnd}=useApp()
const[projects,setProjects]=useState(PROJECTS)
useEffect(()=>{const id=activeAccount?.id;const ds=dateStart?.toISOString();const de=dateEnd?.toISOString();gcpApi.projects(id,ds,de).then(p=>setProjects(p.projects||PROJECTS)).catch(()=>{})},[activeAccount?.id,dateStart,dateEnd])
return(<div style={{display:"flex",flexDirection:"column",gap:24}}><Card><SectionHeader title={t.nav.projects} sub={`${projects.length} active projects`} action="+ Add Project"/><div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto auto",gap:"0 20px"}}>{[t.tables.project,t.tables.environment,t.tables.mtdCost,t.tables.budget,t.tables.utilization,t.tables.status].map(h=>(<div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 14px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>))}{projects.map(p=>{const util=(p.cost/p.budget)*100;return(<div key={p.id} style={{display:"contents"}}><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.name}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{p.id}</div></div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><EnvBadge env={p.env}/></div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.cost)}</div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{fmtFull(p.budget)}</div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:6,borderRadius:3,background:T.progressTrack,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(util,100)}%`,borderRadius:3,background:util>100?"#EF4444":util>90?"#F59E0B":"#34D399"}}/></div><span style={{fontSize:12,fontWeight:600,color:util>100?"#EF4444":util>90?"#F59E0B":"#34D399",minWidth:40}}>{util.toFixed(0)}%</span></div></div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Badge status={p.status}/></div></div>);})}</div></Card></div>);}

function InvoicesPage(){const{t,T}=useApp();return(<div style={{display:"flex",flexDirection:"column",gap:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}><KPICard label={t.kpi.outstanding} value="$0.00" sub={t.kpi.outstandingSub} accent="#34D399"/><KPICard label={t.kpi.lastInvoice} value="$94,100" sub={t.kpi.lastInvoiceSub} accent="#4F8EF7"/><KPICard label={t.kpi.ytdInvoiced} value="$720,800" sub={t.kpi.ytdInvoicedSub} accent="#A78BFA"/></div><Card><SectionHeader title={t.invoices.history} sub={t.invoices.historySub} action={t.invoices.downloadAll}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto auto auto",gap:"0 24px"}}>{[t.invoices.invoiceId,t.invoices.period,t.invoices.amount,t.invoices.status,t.invoices.action].map(h=>(<div key={h} style={{fontSize:11,color:T.textLabel,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",padding:"0 0 14px 0",borderBottom:`1px solid ${T.tableSectionBorder}`}}>{h}</div>))}{INVOICES_DATA.map(inv=>(<div key={inv.id} style={{display:"contents"}}><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.text,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{inv.id}</div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:13,color:T.textSub}}>{inv.period}</div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`,fontSize:14,fontWeight:700,color:T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(inv.amount)}</div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><Badge status={inv.status}/></div><div style={{padding:"16px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><button style={{fontSize:12,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:500}}>{t.invoices.download}</button></div></div>))}</div></Card></div>);}

function BudgetsPage(){const{t,T}=useApp();const{activeAccount,dateStart,dateEnd}=useApp()
const[budgets,setBudgets]=useState(BUDGETS_DATA)
useEffect(()=>{const id=activeAccount?.id;const ds=dateStart?.toISOString();const de=dateEnd?.toISOString();gcpApi.budgets(id,ds,de).then(b=>setBudgets(b.budgets||BUDGETS_DATA)).catch(()=>{})},[activeAccount?.id,dateStart,dateEnd])
return(<div style={{display:"flex",flexDirection:"column",gap:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>{budgets.map(b=>{const over=b.pct>100;const color=b.pct>100?"#EF4444":b.pct>90?"#F59E0B":"#34D399";return(<Card key={b.name}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}><div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{b.name}</div><div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{fmtFull(b.limit)}</div></div><Badge status={b.status}/></div><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:22,fontWeight:800,color:over?"#EF4444":T.text,fontFamily:"'DM Mono',monospace"}}>{fmtFull(b.spent)}</span><span style={{fontSize:28,fontWeight:800,color,fontFamily:"'DM Mono',monospace"}}>{b.pct}%</span></div><div style={{height:10,borderRadius:5,background:T.progressTrack,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(b.pct,100)}%`,borderRadius:5,background:color,boxShadow:`0 0 12px ${color}60`,transition:"width 0.8s ease"}}/></div>{over&&<div style={{fontSize:12,color:"#EF4444",marginTop:8}}>{t.budgets.overBy} {fmtFull(b.spent-b.limit)}</div>}</Card>);})}</div></div>);}

function ReportsPage(){const{t,T}=useApp();return(<div style={{display:"flex",flexDirection:"column",gap:24}}><Card><SectionHeader title={t.reports.generate} sub={t.reports.generateSub}/><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:8}}>{t.reports.types.map((r,i)=>(<div key={i} style={{border:`1px solid ${T.reportCardBorder}`,borderRadius:12,padding:20,cursor:"pointer"}}><div style={{fontSize:22,marginBottom:10}}>{"◈◻◑"[i]}</div><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>{r.title}</div><div style={{fontSize:12,color:T.textSub,lineHeight:1.6,marginBottom:16}}>{r.desc}</div><div style={{display:"flex",gap:8}}><button style={{fontSize:11,color:"#4F8EF7",background:"rgba(79,142,247,0.1)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:600}}>CSV</button><button style={{fontSize:11,color:"#A78BFA",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:600}}>PDF</button></div></div>))}</div></Card><Card><SectionHeader title={t.reports.scheduled} sub={t.reports.scheduledSub} action={t.reports.newSchedule}/>{t.reports.schedules.map((s,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",alignItems:"center",gap:20,padding:"14px 0",borderBottom:`1px solid ${T.tableRowBorder}`}}><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div><div style={{fontSize:12,color:T.textMuted,marginTop:3}}>{s.freq} → {s.recipients}</div></div><span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(79,142,247,0.1)",color:"#4F8EF7",fontWeight:600}}>{s.format}</span><Badge status="active"/><button style={{fontSize:12,color:T.textSub,background:"transparent",border:`1px solid ${T.cardBorder}`,borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>{t.reports.edit}</button></div>))}</Card></div>);}
