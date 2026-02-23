import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { USER_SELECT, nameFilter } from '../../common/constants/prisma-selects';

const TEACHER_LIST_SELECT = {
  id: true,
  subject: true,
  user: { select: USER_SELECT },
} as const;

const TEACHER_DETAIL_SELECT = {
  id: true,
  subject: true,
  created_at: true,
  updated_at: true,
  user: { select: USER_SELECT },
  groups: { select: { id: true, name: true } },
} as const;

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teacher.findMany({ select: TEACHER_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.teacher.findUnique({ where: { id }, select: TEACHER_DETAIL_SELECT }),
      'Teacher',
    );
  }

  async searchByName(name: string) {
    return this.prisma.teacher.findMany({
      where: { user: nameFilter(name) },
      select: TEACHER_LIST_SELECT,
    });
  }

  async searchBySubject(subject: string) {
    return this.prisma.teacher.findMany({
      where: { subject: { contains: subject, mode: 'insensitive' } },
      select: TEACHER_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.teacher.findMany({
      where: { user: { status: status as any } },
      select: TEACHER_LIST_SELECT,
    });
  }

  async create(dto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        subject: dto.subject,
        user: { connect: { id: dto.user_id } },
      },
      select: TEACHER_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateTeacherDto) {
    await this.prisma.validateEntityExists(
      this.prisma.teacher.findUnique({ where: { id } }),
      'Teacher',
    );
    return this.prisma.teacher.update({
      where: { id },
      data: dto,
      select: TEACHER_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.teacher.findUnique({ where: { id } }),
      'Teacher',
    );
    return this.prisma.teacher.delete({ where: { id }, select: { id: true } });
  }
}
