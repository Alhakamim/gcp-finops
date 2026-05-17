import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}
  @Get() list(@Req() req: any) { return this.service.findAll(req.user.tenantId); }
  @Post() create(@Req() req: any, @Body() dto: any) { return this.service.create(req.user.tenantId, dto); }
  @Post(':id/export') export(@Param('id') id: string) { return this.service.export(id); }
}
