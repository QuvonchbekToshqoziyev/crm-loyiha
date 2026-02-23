import { Injectable, Logger, OnModuleInit, OnModuleDestroy, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PasswordUtil } from '../common/utils/password.util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedSuperAdmin();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async validateEntityExists<T>(
    findOperation: Promise<T | null>,
    entityName: string,
  ): Promise<T> {
    const entity = await findOperation;
    if (!entity) {
      throw new NotFoundException(`${entityName} not found`);
    }
    return entity;
  }

  private async seedSuperAdmin() {
    const phone = process.env.SUPERADMIN_PHONE;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!phone || !password) {
      this.logger.warn('SUPERADMIN_PHONE or SUPERADMIN_PASSWORD not set in .env — skipping seed');
      return;
    }

    const existing = await this.user.findUnique({ where: { phone } });
    if (existing) return;

    const hashed = await PasswordUtil.hash(password);
    await this.user.create({
      data: { 
        username: 'superadmin', 
        first_name: 'Super', 
        last_name: 'Admin', 
        phone, 
        password: hashed, 
        role: 'SUPERADMIN' 
      },
    });
    this.logger.log(`SuperAdmin seeded with phone: ${phone}`);
  }
}
