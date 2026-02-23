import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { createAdminDto } from './dto/create-admin.dto';
import { updateAdminDto } from './dto/update-admin.dto';
import { USER_SELECT, nameFilter } from '../../common/constants/prisma-selects';

const ADMIN_LIST_SELECT = {
  id: true,
  admin_status: true,
  user: { select: USER_SELECT },
} as const;

const ADMIN_DETAIL_SELECT = {
  id: true,
  admin_status: true,
  created_at: true,
  updated_at: true,
  user: { select: USER_SELECT },
} as const;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany({ select: ADMIN_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.admin.findUnique({ where: { id }, select: ADMIN_DETAIL_SELECT }),
      'Admin',
    );
  }

  async searchByName(name: string) {
    return this.prisma.admin.findMany({
      where: { user: nameFilter(name) },
      select: ADMIN_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.admin.findMany({
      where: { user: { status: status as any } },
      select: ADMIN_LIST_SELECT,
    });
  }

  async create(dto: createAdminDto) {
    await this.prisma.validateEntityExists(
      this.prisma.user.findUnique({ where: { id: dto.user_id } }),
      'User',
    );

    const [admin] = await this.prisma.$transaction([
      this.prisma.admin.create({
        data: {
          user_id: dto.user_id,
          admin_status: 'active',
        },
        select: ADMIN_LIST_SELECT,
      }),
      this.prisma.user.update({
        where: { id: dto.user_id },
        data: { role: 'ADMIN' },
      }),
    ]);
    return admin;
  }

  async update(id: number, dto: updateAdminDto) {
    await this.prisma.validateEntityExists(
      this.prisma.admin.findUnique({ where: { id } }),
      'Admin',
    );
    return this.prisma.admin.update({
      where: { id },
      data: { admin_status: dto.admin_status },
      select: ADMIN_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.admin.findUnique({ where: { id } }),
      'Admin',
    );
    return this.prisma.admin.delete({ where: { id }, select: { id: true } });
  }
}
