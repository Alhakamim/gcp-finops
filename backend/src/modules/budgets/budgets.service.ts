import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetsService {
  async findAll(tenantId: string) { return []; }
  async create(tenantId: string, dto: any) { return dto; }
  async update(id: string, dto: any) { return dto; }
  async delete(id: string) { return { deleted: true }; }
}
