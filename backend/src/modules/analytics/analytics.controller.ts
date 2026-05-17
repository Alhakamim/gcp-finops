import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './services/analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  getOverview(@Req() req: any, @Query('accountId') accountId: string) {
    return this.service.getOverview(req.user.tenantId, accountId);
  }

  @Get('cost-trend')
  @ApiOperation({ summary: 'Get cost trend data' })
  getCostTrend(@Req() req: any, @Query('accountId') accountId: string, @Query('period') period: string = '30d') {
    return this.service.getCostTrend(req.user.tenantId, accountId, period);
  }

  @Get('top-services')
  @ApiOperation({ summary: 'Get top services by cost' })
  getTopServices(@Req() req: any, @Query('accountId') accountId: string, @Query('limit') limit: number = 10) {
    return this.service.getTopServices(req.user.tenantId, accountId, limit);
  }

  @Get('monthly-trend')
  @ApiOperation({ summary: 'Get monthly cost comparison' })
  getMonthlyTrend(@Req() req: any, @Query('accountId') accountId: string, @Query('months') months: number = 12) {
    return this.service.getMonthlyTrend(req.user.tenantId, accountId, months);
  }
}
