import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  constructor() {}

  async getOverview(tenantId: string, accountId: string) {
    return {
      totalCostMTD: 45231.89,
      projectedCost: 67250.00,
      monthlyBudget: 80000.00,
      budgetUsagePct: 56.5,
      lastMonthCost: 68120.45,
      costChangePct: -33.6,
      dailyAverage: 1507.73,
      activeServices: 12,
      activeProjects: 8,
      anomaliesCount: 3,
    };
  }

  async getCostTrend(tenantId: string, accountId: string, period: string) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toISOString().split('T')[0],
        cost: +(Math.random() * 2000 + 1000).toFixed(2),
      });
    }
    return { period, days, data, total: data.reduce((s, d) => s + d.cost, 0) };
  }

  async getTopServices(tenantId: string, accountId: string, limit: number) {
    const services = [
      { name: 'Compute Engine', cost: 18230.45, percentage: 32.1, skus: 45 },
      { name: 'Cloud Storage', cost: 8920.12, percentage: 15.7, skus: 28 },
      { name: 'BigQuery', cost: 6540.80, percentage: 11.5, skus: 18 },
      { name: 'Cloud SQL', cost: 5230.00, percentage: 9.2, skus: 12 },
      { name: 'GKE', cost: 4890.33, percentage: 8.6, skus: 22 },
      { name: 'Cloud Networking', cost: 3450.67, percentage: 6.1, skus: 15 },
      { name: 'Cloud Functions', cost: 2340.50, percentage: 4.1, skus: 8 },
      { name: 'Pub/Sub', cost: 1890.22, percentage: 3.3, skus: 6 },
      { name: 'Cloud CDN', cost: 1200.45, percentage: 2.1, skus: 4 },
      { name: 'Cloud DNS', cost: 890.33, percentage: 1.6, skus: 3 },
    ];
    return services.slice(0, limit);
  }

  async getMonthlyTrend(tenantId: string, accountId: string, months: number) {
    const data = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        cost: +(Math.random() * 30000 + 30000).toFixed(2),
      });
    }
    return data;
  }
}
