import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './services/billing.service';
import { ForecastService } from './services/forecast.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('billing')
export class BillingController {
  constructor(
    private billing: BillingService,
    private forecast: ForecastService,
  ) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List billing accounts' })
  getAccounts(@Req() req: any) {
    return this.billing.getAccounts(req.user.tenantId);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get billing account details' })
  getAccount(@Req() req: any, @Param('id') id: string) {
    return this.billing.getAccount(req.user.tenantId, id);
  }

  @Get('accounts/:id/summary')
  @ApiOperation({ summary: 'Get billing account summary with costs' })
  getSummary(@Req() req: any, @Param('id') id: string) {
    return this.billing.getAccountSummary(req.user.tenantId, id);
  }

  @Get('accounts/:id/costs')
  @ApiOperation({ summary: 'Get cost data with filters' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'service', required: false })
  getCosts(
    @Req() req: any,
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('projectId') projectId?: string,
    @Query('service') service?: string,
  ) {
    return this.billing.getCosts(req.user.tenantId, id, { startDate, endDate, projectId, service });
  }

  @Get('accounts/:id/services')
  @ApiOperation({ summary: 'Get service/SKU breakdown' })
  getServices(
    @Req() req: any,
    @Param('id') id: string,
    @Query('startDate') startDate: string = '',
    @Query('endDate') endDate: string = '',
  ) {
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    return this.billing.getServiceBreakdown(req.user.tenantId, id, start, end);
  }

  @Get('accounts/:id/anomalies')
  @ApiOperation({ summary: 'Get cost anomalies' })
  getAnomalies(@Req() req: any, @Param('id') id: string) {
    return this.billing.getCostAnomalies(req.user.tenantId, id);
  }

  @Get('accounts/:id/forecast')
  @ApiOperation({ summary: 'Get cost forecast' })
  getForecast(@Param('id') id: string, @Query('days') days?: number) {
    return this.forecast.forecast(id, days || 30);
  }

  @Get('accounts/:id/trend')
  @ApiOperation({ summary: 'Get daily cost trend' })
  getTrend(@Param('id') id: string, @Query('days') days?: number) {
    return this.forecast.getDailyTrend(id, days || 90);
  }
}
