import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}

import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private service: CustomersService) {}
  @Get() @Roles('admin', 'manager') list(@Req() req: any) { return this.service.findAll(req.user.tenantId); }
  @Post() @Roles('admin') create(@Req() req: any, @Body() dto: any) { return this.service.create(req.user.tenantId, dto); }
  @Get(':id') get(@Param('id') id: string) { return this.service.findById(id); }
}

export class CustomersService {
  async findAll(tenantId: string) { return []; }
  async create(tenantId: string, dto: any) { return dto; }
  async findById(id: string) { return null; }
}
