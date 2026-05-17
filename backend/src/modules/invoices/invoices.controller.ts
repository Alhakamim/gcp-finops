import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private service: InvoicesService) {}
  @Get() list(@Req() req: any, @Query('accountId') accountId: string) { return this.service.findAll(req.user.tenantId, accountId); }
  @Get(':id') get(@Param('id') id: string) { return this.service.findById(id); }
}
