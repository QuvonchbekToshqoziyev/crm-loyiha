import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { USER_SELECT, nameFilter } from '../../common/constants/prisma-selects';

const STUDENT_LIST_SELECT = {
  id: true,
  user: { select: USER_SELECT },
} as const;

const STUDENT_DETAIL_SELECT = {
  id: true,
  created_at: true,
  updated_at: true,
  user: { select: USER_SELECT },
  groupStudents: { select: { group: { select: { id: true, name: true } } } },
} as const;

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page?: number, limit?: number) {
    const query: any = { select: STUDENT_LIST_SELECT };

    if (limit) {
      query.take = limit;
      if (page && page > 1) {
        query.skip = (page - 1) * limit;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.student.findMany(query),
      this.prisma.student.count(),
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
      this.prisma.student.findUnique({ where: { id }, select: STUDENT_DETAIL_SELECT }),
      'Student',
    );
  }

  async searchByName(name: string) {
    return this.prisma.student.findMany({
      where: { user: nameFilter(name) },
      select: STUDENT_LIST_SELECT,
    });
  }

  async searchByGroup(groupId: number) {
    return this.prisma.student.findMany({
      where: { groupStudents: { some: { group_id: groupId } } },
      select: STUDENT_LIST_SELECT,
    });
  }

  async searchByCourse(courseId: number) {
    return this.prisma.student.findMany({
      where: { groupStudents: { some: { group: { course_id: courseId } } } },
      select: STUDENT_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.student.findMany({
      where: { user: { status: status as any } },
      select: STUDENT_LIST_SELECT,
    });
  }

  async create(dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        user: { connect: { id: dto.user_id } },
      },
      select: STUDENT_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.prisma.validateEntityExists(
      this.prisma.student.findUnique({ where: { id } }),
      'Student',
    );
    return this.prisma.student.update({
      where: { id },
      data: dto,
      select: STUDENT_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.student.findUnique({ where: { id } }),
      'Student',
    );
    return this.prisma.student.update({ where: { id }, data: { user: { update: { status: 'inactive' } } }, select: STUDENT_LIST_SELECT });
  }
}
