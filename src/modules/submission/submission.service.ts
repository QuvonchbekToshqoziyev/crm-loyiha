import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

const SUBMISSION_LIST_SELECT = {
  id: true,
  content: true,
  file_url: true,
  submitted_at: true,
  status: true,
  homework: { select: { id: true, title: true } },
  student: { select: { id: true, user: { select: USER_NAME_SELECT } } },
} as const;

const SUBMISSION_DETAIL_SELECT = {
  id: true,
  content: true,
  file_url: true,
  submitted_at: true,
  status: true,
  created_at: true,
  updated_at: true,
  homework: { select: { id: true, title: true, lesson: { select: { id: true, topic: true } } } },
  student: { select: { id: true, user: { select: USER_SELECT } } },
  grade: {
    select: {
      id: true,
      grade: true,
      comment: true,
      graded_by: { select: { id: true, user: { select: USER_NAME_SELECT } } },
    },
  },
} as const;

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.studentHomeworkSubmission.findMany({ select: SUBMISSION_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.studentHomeworkSubmission.findUnique({ where: { id }, select: SUBMISSION_DETAIL_SELECT }),
      'Submission',
    );
  }

  async searchByHomework(homeworkId: number) {
    return this.prisma.studentHomeworkSubmission.findMany({
      where: { homework_id: homeworkId },
      select: SUBMISSION_LIST_SELECT,
    });
  }

  async searchByStudent(studentId: number) {
    return this.prisma.studentHomeworkSubmission.findMany({
      where: { student_id: studentId },
      select: SUBMISSION_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.studentHomeworkSubmission.findMany({
      where: { status: status as any },
      select: SUBMISSION_LIST_SELECT,
    });
  }

  async create(dto: CreateSubmissionDto) {
    return this.prisma.studentHomeworkSubmission.create({
      data: {
        content: dto.content,
        file_url: dto.file_url,
        homework: { connect: { id: dto.homework_id } },
        student: { connect: { id: dto.student_id } },
      },
      select: SUBMISSION_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateSubmissionDto) {
    await this.prisma.validateEntityExists(
      this.prisma.studentHomeworkSubmission.findUnique({ where: { id } }),
      'Submission',
    );

    return this.prisma.studentHomeworkSubmission.update({
      where: { id },
      data: {
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.file_url !== undefined && { file_url: dto.file_url }),
        ...(dto.status && { status: dto.status as any }),
      },
      select: SUBMISSION_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.studentHomeworkSubmission.findUnique({ where: { id } }),
      'Submission',
    );
    return this.prisma.studentHomeworkSubmission.delete({ where: { id }, select: { id: true } });
  }
}
