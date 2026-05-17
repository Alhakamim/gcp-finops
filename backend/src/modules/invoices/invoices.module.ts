import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}

import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private service: InvoicesService) {}
  @Get() list(@Req() req: any, @Query('accountId') accountId: string) { return this.service.findAll(req.user.tenantId, accountId); }
  @Get(':id') get(@Param('id') id: string) { return this.service.findById(id); }
}

export class InvoicesService {
  async findAll(tenantId: string, accountId?: string) { return []; }
  async findById(id: string) { return null; }
}
