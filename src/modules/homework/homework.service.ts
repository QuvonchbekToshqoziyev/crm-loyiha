import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

const HOMEWORK_LIST_SELECT = {
  id: true,
  title: true,
  due_date: true,
  status: true,
  lesson: { select: { id: true, topic: true } },
} as const;

const HOMEWORK_DETAIL_SELECT = {
  id: true,
  title: true,
  description: true,
  due_date: true,
  status: true,
  created_at: true,
  updated_at: true,
  lesson: { select: { id: true, topic: true, group: { select: { id: true, name: true } } } },
  _count: { select: { submissions: true } },
} as const;

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async findAll(page?: number, limit?: number) {
    const query: any = { select: HOMEWORK_LIST_SELECT };

    if (limit) {
      query.take = limit;
      if (page && page > 1) {
        query.skip = (page - 1) * limit;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.homework.findMany(query),
      this.prisma.homework.count(),
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
      this.prisma.homework.findUnique({ where: { id }, select: HOMEWORK_DETAIL_SELECT }),
      'Homework',
    );
  }

  async searchByTitle(title: string) {
    return this.prisma.homework.findMany({
      where: { title: { contains: title, mode: 'insensitive' } },
      select: HOMEWORK_LIST_SELECT,
    });
  }

  async searchByLesson(lessonId: number) {
    return this.prisma.homework.findMany({
      where: { lesson_id: lessonId },
      select: HOMEWORK_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.homework.findMany({
      where: { status: status as any },
      select: HOMEWORK_LIST_SELECT,
    });
  }

  async create(dto: CreateHomeworkDto) {
    return this.prisma.homework.create({
      data: {
        title: dto.title,
        description: dto.description,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined,
        lesson: { connect: { id: dto.lesson_id } },
      },
      select: HOMEWORK_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateHomeworkDto) {
    await this.prisma.validateEntityExists(
      this.prisma.homework.findUnique({ where: { id } }),
      'Homework',
    );

    return this.prisma.homework.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.due_date !== undefined && { due_date: dto.due_date ? new Date(dto.due_date) : null }),
        ...(dto.status && { status: dto.status as any }),
      },
      select: HOMEWORK_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.homework.findUnique({ where: { id } }),
      'Homework',
    );
    return this.prisma.homework.update({
      where: { id },
      data: { status: 'inactive' },
      select: HOMEWORK_LIST_SELECT,
    });
  }
}
