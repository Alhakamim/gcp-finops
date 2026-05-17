import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private service: AdminService) {}
  @Get('users') @Roles('admin') getUsers(@Req() req: any) { return this.service.getUsers(req.user.tenantId); }
  @Get('audit-logs') @Roles('admin') getAuditLogs(@Req() req: any) { return this.service.getAuditLogs(req.user.tenantId); }
  @Get('api-keys') @Roles('admin') getApiKeys(@Req() req: any) { return this.service.getApiKeys(req.user.tenantId); }
  @Post('api-keys') @Roles('admin') createApiKey(@Req() req: any, @Body() dto: any) { return this.service.createApiKey(req.user.tenantId, dto); }
  @Delete('api-keys/:id') @Roles('admin') deleteApiKey(@Param('id') id: string) { return this.service.deleteApiKey(id); }
}

export class AdminService {
  async getUsers(tenantId: string) { return []; }
  async getAuditLogs(tenantId: string) { return []; }
  async getApiKeys(tenantId: string) { return []; }
  async createApiKey(tenantId: string, dto: any) { return dto; }
  async deleteApiKey(id: string) { return { deleted: true }; }
}
