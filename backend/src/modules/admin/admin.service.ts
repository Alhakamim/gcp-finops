import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getUsers(tenantId: string) { return []; }
  async getAuditLogs(tenantId: string) { return []; }
  async getApiKeys(tenantId: string) { return []; }
  async createApiKey(tenantId: string, dto: any) { return dto; }
  async deleteApiKey(id: string) { return { deleted: true }; }
}
