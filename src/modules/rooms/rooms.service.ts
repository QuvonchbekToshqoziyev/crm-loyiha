import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

const ROOM_LIST_SELECT = {
  id: true,
  name: true,
  capacity: true,
  status: true,
} as const;

const ROOM_DETAIL_SELECT = {
  ...ROOM_LIST_SELECT,
  created_at: true,
  updated_at: true,
  groups: { select: { id: true, name: true } },
} as const;

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.room.findMany({ select: ROOM_LIST_SELECT });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.room.findUnique({ where: { id }, select: ROOM_DETAIL_SELECT }),
      'Room',
    );
  }

  async searchByName(name: string) {
    return this.prisma.room.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      select: ROOM_LIST_SELECT,
    });
  }

  async searchByCapacity(minCapacity: number, maxCapacity?: number) {
    return this.prisma.room.findMany({
      where: { capacity: { gte: minCapacity, ...(maxCapacity && { lte: maxCapacity }) } },
      select: ROOM_LIST_SELECT,
    });
  }

  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({ data: dto, select: ROOM_LIST_SELECT });
  }

  async update(id: number, dto: UpdateRoomDto) {
    await this.prisma.validateEntityExists(
      this.prisma.room.findUnique({ where: { id } }),
      'Room',
    );
    return this.prisma.room.update({ where: { id }, data: dto, select: ROOM_LIST_SELECT });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.room.findUnique({ where: { id } }),
      'Room',
    );
    return this.prisma.room.update({ where: { id }, data: { status: 'inactive' }, select: ROOM_LIST_SELECT });
  }
}
