import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

const COURSE_LIST_SELECT = {
  id: true,
  name: true,
  price: true,
  level: true,
  status: true,
  duration_month: true,
  duration_hours: true,
} as const;

const COURSE_DETAIL_SELECT = {
  ...COURSE_LIST_SELECT,
  description: true,
  created_at: true,
  updated_at: true,
  groups: { select: { id: true, name: true } },
} as const;

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({ select: COURSE_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.course.findUnique({ where: { id }, select: COURSE_DETAIL_SELECT }),
      'Course',
    );
  }

  async searchByName(name: string) {
    return this.prisma.course.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      select: COURSE_LIST_SELECT,
    });
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        duration_month: dto.duration_month,
        duration_hours: dto.duration_hours,
        level: dto.level,
      },
      select: COURSE_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    await this.prisma.validateEntityExists(
      this.prisma.course.findUnique({ where: { id } }),
      'Course',
    );
    return this.prisma.course.update({ where: { id }, data: dto, select: COURSE_LIST_SELECT });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.course.findUnique({ where: { id } }),
      'Course',
    );
    return this.prisma.course.update({ where: { id }, data: { status: 'inactive' }, select: COURSE_LIST_SELECT });
  }
}
