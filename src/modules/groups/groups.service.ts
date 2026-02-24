import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { USER_SELECT, USER_NAME_SELECT } from '../../common/constants/prisma-selects';

const GROUP_LIST_SELECT = {
  id: true,
  name: true,
  status: true,
  course: { select: { id: true, name: true } },
  teacher: { select: { id: true, user: { select: USER_NAME_SELECT } } },
  room: { select: { id: true, name: true } },
  _count: { select: { groupStudents: true } },
} as const;

const GROUP_DETAIL_SELECT = {
  id: true,
  name: true,
  status: true,
  created_at: true,
  updated_at: true,
  course: { select: { id: true, name: true, level: true } },
  teacher: { select: { id: true, subject: true, user: { select: USER_SELECT } } },
  room: { select: { id: true, name: true, capacity: true } },
  groupStudents: {
    select: {
      student: { select: { id: true, user: { select: USER_NAME_SELECT } } },
    },
  },
} as const;

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({ select: GROUP_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.group.findUnique({ where: { id }, select: GROUP_DETAIL_SELECT }),
      'Group',
    );
  }

  async searchByCourse(courseId: number) {
    return this.prisma.group.findMany({
      where: { course_id: courseId },
      select: GROUP_LIST_SELECT,
    });
  }

  async searchByTeacher(teacherId: number) {
    return this.prisma.group.findMany({
      where: { teacher_id: teacherId },
      select: GROUP_LIST_SELECT,
    });
  }

  async searchByRoom(roomId: number) {
    return this.prisma.group.findMany({
      where: { room_id: roomId },
      select: GROUP_LIST_SELECT,
    });
  }

  async searchByName(name: string) {
    return this.prisma.group.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      select: GROUP_LIST_SELECT,
    });
  }

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        course: { connect: { id: dto.course_id } },
        teacher: { connect: { id: dto.teacher_id } },
        ...(dto.room_id && { room: { connect: { id: dto.room_id } } }),
      },
      select: GROUP_LIST_SELECT,
    });
  }

  async update(id: number, dto: UpdateGroupDto) {
    await this.prisma.validateEntityExists(
      this.prisma.group.findUnique({ where: { id } }),
      'Group',
    );

    const { course_id, teacher_id, room_id, ...rest } = dto;
    return this.prisma.group.update({
      where: { id },
      data: {
        ...rest,
        ...(course_id && { course: { connect: { id: course_id } } }),
        ...(teacher_id && { teacher: { connect: { id: teacher_id } } }),
        ...(room_id !== undefined && {
          room: room_id ? { connect: { id: room_id } } : { disconnect: true },
        }),
      },
      select: GROUP_LIST_SELECT,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.group.findUnique({ where: { id } }),
      'Group',
    );
    return this.prisma.group.update({ where: { id }, data: { status: 'inactive' }, select: GROUP_LIST_SELECT });
  }
}