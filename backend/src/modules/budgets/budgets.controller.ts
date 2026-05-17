import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BudgetsService } from './budgets.service';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('budgets')
export class BudgetsController {
  constructor(private service: BudgetsService) {}
  @Get() list(@Req() req: any) { return this.service.findAll(req.user.tenantId); }
  @Post() create(@Req() req: any, @Body() dto: any) { return this.service.create(req.user.tenantId, dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }
  @Delete(':id') delete(@Param('id') id: string) { return this.service.delete(id); }
}
