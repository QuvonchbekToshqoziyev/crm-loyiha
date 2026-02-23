import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

const ATTENDANCE_LIST_SELECT = {
  id: true,
  attended: true,
  late: true,
  status: true,
  lesson: { select: { id: true, topic: true } },
  student: { select: { id: true, user: { select: USER_NAME_SELECT } } },
} as const;

const ATTENDANCE_DETAIL_SELECT = {
  id: true,
  attended: true,
  late: true,
  status: true,
  created_at: true,
  updated_at: true,
  lesson: { select: { id: true, topic: true, group: { select: { id: true, name: true } } } },
  student: { select: { id: true, user: { select: USER_SELECT } } },
} as const;

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.attendance.findMany({ select: ATTENDANCE_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.attendance.findUnique({ where: { id }, select: ATTENDANCE_DETAIL_SELECT }),
      'Attendance',
    );
  }

  async searchByLesson(lessonId: number) {
    return this.prisma.attendance.findMany({
      where: { lesson_id: lessonId },
      select: ATTENDANCE_LIST_SELECT,
    });
  }

  async searchByStudent(studentId: number) {
    return this.prisma.attendance.findMany({
      where: { student_id: studentId },
      select: ATTENDANCE_LIST_SELECT,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.attendance.findMany({
      where: { status: status as any },
      select: ATTENDANCE_LIST_SELECT,
    });
  }

  async create(dto: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        attended: dto.attended,
        late: dto.late,
        lesson: { connect: { id: dto.lesson_id } },
        student: { connect: { id: dto.student_id } },
      },
      select: ATTENDANCE_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    await this.prisma.validateEntityExists(
      this.prisma.attendance.findUnique({ where: { id } }),
      'Attendance',
    );

    return this.prisma.attendance.update({
      where: { id },
      data: {
        ...(dto.attended !== undefined && { attended: dto.attended }),
        ...(dto.late !== undefined && { late: dto.late }),
        ...(dto.status && { status: dto.status as any }),
      },
      select: ATTENDANCE_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.attendance.findUnique({ where: { id } }),
      'Attendance',
    );
    return this.prisma.attendance.delete({ where: { id }, select: { id: true } });
  }
}
