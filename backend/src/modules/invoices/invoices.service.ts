import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoicesService {
  async findAll(tenantId: string, accountId?: string) { return []; }
  async findById(id: string) { return null; }
}
