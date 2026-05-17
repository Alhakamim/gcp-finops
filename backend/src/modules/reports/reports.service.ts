import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async findAll(tenantId: string) { return []; }
  async create(tenantId: string, dto: any) { return dto; }
  async export(id: string) { return { url: '/reports/export/sample.csv' }; }
}
