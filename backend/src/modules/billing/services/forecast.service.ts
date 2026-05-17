import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class ForecastService {
  private readonly logger = new Logger(ForecastService.name);

  constructor(private prisma: PrismaService) {}

  async forecast(accountId: string, days: number = 30) {
    // Get last 90 days of data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const costs = await this.prisma.dailyCost.findMany({
      where: {
        billingAccountId: accountId,
        date: { gte: ninetyDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (costs.length < 7) {
      return { forecast: [], confidence: 'low', message: 'Insufficient data for forecasting' };
    }

    // Simple linear regression forecast
    const dailyTotals = this.aggregateByDate(costs);
    const forecast = this.linearRegression(dailyTotals, days);

    // Calculate confidence based on data variance
    const values = dailyTotals.map(d => d.cost);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean; // coefficient of variation

    const confidence = cv < 0.15 ? 'high' : cv < 0.3 ? 'medium' : 'low';

    return { forecast, confidence, dataPoints: dailyTotals.length };
  }

  private aggregateByDate(costs: any[]) {
    const map = new Map<string, number>();
    for (const c of costs) {
      const key = c.date.toISOString().split('T')[0];
      map.set(key, (map.get(key) || 0) + c.cost);
    }
    return Array.from(map.entries())
      .map(([date, cost]) => ({ date, cost: Math.round(cost * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private linearRegression(data: { date: string; cost: number }[], forecastDays: number) {
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data.map(d => d.cost);

    const xMean = xValues.reduce((s, x) => s + x, 0) / n;
    const yMean = yValues.reduce((s, y) => s + y, 0) / n;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) ** 2;
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    const forecasts = [];
    const lastDate = new Date(data[data.length - 1].date);

    for (let i = 1; i <= forecastDays; i++) {
      const x = n + i - 1;
      const predictedCost = Math.max(0, slope * x + intercept);
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);

      forecasts.push({
        date: forecastDate.toISOString().split('T')[0],
        predictedCost: Math.round(predictedCost * 100) / 100,
      });
    }

    return forecasts;
  }

  async getDailyTrend(accountId: string, days: number = 90) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const costs = await this.prisma.dailyCost.findMany({
      where: {
        billingAccountId: accountId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
      select: { date: true, cost: true, service: true },
    });

    const daily = this.aggregateByDate(costs);
    const total = daily.reduce((s, d) => s + d.cost, 0);
    const avg = daily.length > 0 ? total / daily.length : 0;

    return { daily, total: Math.round(total * 100) / 100, average: Math.round(avg * 100) / 100, days: daily.length };
  }
}
