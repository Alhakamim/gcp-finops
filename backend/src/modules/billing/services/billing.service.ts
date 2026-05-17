import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private prisma: PrismaService) {}

  async getAccounts(tenantId: string) {
    return this.prisma.billingAccount.findMany({
      where: { tenantId },
      include: {
        _count: { select: { projects: true, costs: true, invoices: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAccount(tenantId: string, id: string) {
    const account = await this.prisma.billingAccount.findFirst({
      where: { id, tenantId },
      include: {
        projects: true,
        _count: { select: { costs: true, invoices: true, budgets: true } },
      },
    });
    if (!account) throw new NotFoundException('Billing account not found');
    return account;
  }

  async getAccountSummary(tenantId: string, accountId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [costs, projects, recentCosts] = await Promise.all([
      this.prisma.dailyCost.aggregate({
        where: { billingAccountId: accountId, date: { gte: thirtyDaysAgo } },
        _sum: { cost: true },
      }),
      this.prisma.gCPProject.count({
        where: { billingAccountId: accountId, status: 'active' },
      }),
      this.prisma.dailyCost.findMany({
        where: { billingAccountId: accountId },
        orderBy: { date: 'desc' },
        take: 90,
        select: { date: true, cost: true, service: true, projectId: true },
      }),
    ]);

    return {
      totalCostLast30Days: costs._sum.cost || 0,
      activeProjects: projects,
      dailyCosts: recentCosts.reverse(),
    };
  }

  async getCosts(
    tenantId: string,
    accountId: string,
    filters: { startDate?: string; endDate?: string; projectId?: string; service?: string },
  ) {
    const where: any = { billingAccountId: accountId };
    if (filters.startDate) where.date = { ...where.date, gte: new Date(filters.startDate) };
    if (filters.endDate) where.date = { ...where.date, lte: new Date(filters.endDate) };
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.service) where.service = filters.service;

    const costs = await this.prisma.dailyCost.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { project: { select: { name: true } } },
    });

    // Aggregations
    const total = costs.reduce((s, c) => s + c.cost, 0);
    const byService = this.groupBy(costs, 'service');
    const byProject = this.groupBy(costs, 'projectId');

    return { costs, total, byService, byProject, count: costs.length };
  }

  async getServiceBreakdown(
    tenantId: string,
    accountId: string,
    startDate: string,
    endDate: string,
  ) {
    const costs = await this.prisma.dailyCost.findMany({
      where: {
        billingAccountId: accountId,
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
    });

    const breakdown: Record<string, { service: string; total: number; percentage: number; skus: Record<string, number> }> = {};
    const grandTotal = costs.reduce((s, c) => s + c.cost, 0);

    for (const c of costs) {
      if (!breakdown[c.service ?? ""]) breakdown[c.service ?? ""] = { service: c.service ?? "", total: 0, percentage: 0, skus: {} };
      breakdown[c.service ?? ""].total += c.cost;
      if (c.sku) breakdown[c.service ?? ""].skus[c.sku] = (breakdown[c.service ?? ""].skus[c.sku] || 0) + c.cost;
    }

    for (const key of Object.keys(breakdown)) {
      breakdown[key].percentage = grandTotal > 0 ? (breakdown[key].total / grandTotal) * 100 : 0;
    }

    return Object.values(breakdown).sort((a, b) => b.total - a.total);
  }

  async getCostAnomalies(tenantId: string, accountId: string) {
    return this.prisma.costAnomaly.findMany({
      where: { billingAccountId: accountId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { project: { select: { name: true } } },
    });
  }

  private groupBy(items: any[], key: string) {
    const grouped: Record<string, number> = {};
    for (const item of items) {
      const val = item[key] || 'unknown';
      grouped[val] = (grouped[val] || 0) + item.cost;
    }
    return Object.entries(grouped)
      .map(([k, v]) => ({ key: k, total: v }))
      .sort((a, b) => b.total - a.total);
  }
}
