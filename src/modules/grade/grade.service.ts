import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

const GRADE_LIST_SELECT = {
  id: true,
  grade: true,
  comment: true,
  submission: {
    select: {
      id: true,
      homework: { select: { id: true, title: true } },
      student: { select: { id: true, user: { select: USER_NAME_SELECT } } },
    },
  },
  graded_by: { select: { id: true, user: { select: USER_NAME_SELECT } } },
} as const;

const GRADE_DETAIL_SELECT = {
  id: true,
  grade: true,
  comment: true,
  created_at: true,
  updated_at: true,
  submission: {
    select: {
      id: true,
      content: true,
      submitted_at: true,
      homework: { select: { id: true, title: true, lesson: { select: { id: true, topic: true } } } },
      student: { select: { id: true, user: { select: USER_SELECT } } },
    },
  },
  graded_by: { select: { id: true, user: { select: USER_SELECT } } },
} as const;

@Injectable()
export class GradeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.gradeStudentHomework.findMany({ select: GRADE_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.gradeStudentHomework.findUnique({ where: { id }, select: GRADE_DETAIL_SELECT }),
      'Grade',
    );
  }

  async searchBySubmission(submissionId: number) {
    return this.prisma.gradeStudentHomework.findUnique({
      where: { submission_id: submissionId },
      select: GRADE_LIST_SELECT,
    });
  }

  async searchByStudent(studentId: number) {
    return this.prisma.gradeStudentHomework.findMany({
      where: { submission: { student_id: studentId } },
      select: GRADE_LIST_SELECT,
    });
  }

  async searchByTeacher(teacherId: number) {
    return this.prisma.gradeStudentHomework.findMany({
      where: { graded_by_id: teacherId },
      select: GRADE_LIST_SELECT,
    });
  }

  async create(dto: CreateGradeDto) {
    return this.prisma.gradeStudentHomework.create({
      data: {
        grade: dto.grade,
        comment: dto.comment,
        submission: { connect: { id: dto.submission_id } },
        graded_by: { connect: { id: dto.graded_by_id } },
      },
      select: GRADE_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateGradeDto) {
    await this.prisma.validateEntityExists(
      this.prisma.gradeStudentHomework.findUnique({ where: { id } }),
      'Grade',
    );

    return this.prisma.gradeStudentHomework.update({
      where: { id },
      data: {
        ...(dto.grade !== undefined && { grade: dto.grade }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
      },
      select: GRADE_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.gradeStudentHomework.findUnique({ where: { id } }),
      'Grade',
    );
    return this.prisma.gradeStudentHomework.delete({ where: { id }, select: { id: true } });
  }
}
