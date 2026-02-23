import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateStudentGroupDto } from './dto/create.studentgroup.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

@Injectable()
export class StudentGroupService {
  constructor(private prisma: PrismaService) {}

  async addStudentToGroup(dto: CreateStudentGroupDto) {
    await this.prisma.validateEntityExists(
      this.prisma.student.findUnique({ where: { id: dto.student_id } }),
      'Student',
    );

    await this.prisma.validateEntityExists(
      this.prisma.group.findUnique({ where: { id: dto.group_id } }),
      'Group',
    );

    const existing = await this.prisma.groupStudent.findUnique({
      where: {
        group_id_student_id: {
          student_id: dto.student_id,
          group_id: dto.group_id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Student is already enrolled in this group');
    }

    return this.prisma.groupStudent.create({
      data: {
        student_id: dto.student_id,
        group_id: dto.group_id,
      },
      select: {
        id: true,
        student: { select: { id: true, user: { select: USER_NAME_SELECT } } },
        group: { select: { id: true, name: true } },
      },
    });
  }

  async removeStudentFromGroup(studentId: number, groupId: number) {
    await this.prisma.validateEntityExists(
      this.prisma.groupStudent.findUnique({
        where: {
          group_id_student_id: {
            student_id: studentId,
            group_id: groupId,
          },
        },
      }),
      'Student-Group relationship',
    );

    return this.prisma.groupStudent.delete({
      where: {
        group_id_student_id: {
          student_id: studentId,
          group_id: groupId,
        },
      },
      select: { id: true },
    });
  }

  async getStudentsByGroup(groupId: number) {
    await this.prisma.validateEntityExists(
      this.prisma.group.findUnique({ where: { id: groupId } }),
      'Group',
    );

    return this.prisma.groupStudent.findMany({
      where: { group_id: groupId },
      select: {
        student: { select: { id: true, user: { select: USER_SELECT } } },
      },
    });
  }

  async getGroupsByStudent(studentId: number) {
    await this.prisma.validateEntityExists(
      this.prisma.student.findUnique({ where: { id: studentId } }),
      'Student',
    );

    return this.prisma.groupStudent.findMany({
      where: { student_id: studentId },
      select: {
        group: {
          select: {
            id: true,
            name: true,
            course: { select: { id: true, name: true } },
          },
        },
      },
    });
  }
}
