import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  async findAll(tenantId: string) { return []; }
  async create(tenantId: string, dto: any) { return dto; }
  async findById(id: string) { return null; }
}
