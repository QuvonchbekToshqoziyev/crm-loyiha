import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

const LESSON_LIST_SELECT = {
  id: true,
  topic: true,
  status: true,
  group: { select: { id: true, name: true } },
  teacher: { select: { id: true, user: { select: USER_NAME_SELECT } } },
} as const;

const LESSON_DETAIL_SELECT = {
  id: true,
  topic: true,
  description: true,
  status: true,
  created_at: true,
  updated_at: true,
  group: { select: { id: true, name: true } },
  teacher: { select: { id: true, subject: true, user: { select: USER_SELECT } } },
} as const;

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async findAll(page?: number, limit?: number) {
    const query: any = { select: LESSON_LIST_SELECT };

    if (limit) {
      query.take = limit;
      if (page && page > 1) {
        query.skip = (page - 1) * limit;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.lesson.findMany(query),
      this.prisma.lesson.count(),
    ]);

    return {
      data,
      total,
      ...(limit && {
        page: page || 1,
        limit,
        lastPage: Math.ceil(total / limit),
      }),
    };
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.lesson.findUnique({ where: { id }, select: LESSON_DETAIL_SELECT }),
      'Lesson',
    );
  }

  async searchByTopic(topic: string) {
    return this.prisma.lesson.findMany({
      where: { topic: { contains: topic, mode: 'insensitive' } },
      select: LESSON_LIST_SELECT,
    });
  }

  async searchByGroup(groupId: number) {
    return this.prisma.lesson.findMany({
      where: { group_id: groupId },
      select: LESSON_LIST_SELECT,
    });
  }

  async searchByTeacher(teacherId: number) {
    return this.prisma.lesson.findMany({
      where: { teacher_id: teacherId },
      select: LESSON_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.lesson.findMany({
      where: { status: status as any },
      select: LESSON_LIST_SELECT,
    });
  }

  async create(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        topic: dto.topic,
        description: dto.description,
        group: { connect: { id: dto.group_id } },
        ...(dto.teacher_id && { teacher: { connect: { id: dto.teacher_id } } }),
      },
      select: LESSON_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateLessonDto) {
    await this.prisma.validateEntityExists(
      this.prisma.lesson.findUnique({ where: { id } }),
      'Lesson',
    );

    const { group_id, teacher_id, status, ...rest } = dto;
    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...rest,
        ...(status && { status: status as any }),
        ...(group_id && { group: { connect: { id: group_id } } }),
        ...(teacher_id !== undefined && {
          teacher: teacher_id ? { connect: { id: teacher_id } } : { disconnect: true },
        }),
      },
      select: LESSON_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.lesson.findUnique({ where: { id } }),
      'Lesson',
    );
    return this.prisma.lesson.update({ where: { id }, data: { status: 'inactive' }, select: LESSON_LIST_SELECT });
  }
}
