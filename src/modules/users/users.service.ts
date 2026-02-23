import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordUtil } from '../../common/utils/password.util';
import { USER_SELECT_WITH_DATES, nameFilter } from '../../common/constants/prisma-selects';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}


  async findAll() {
    return this.prisma.user.findMany({ select: USER_SELECT_WITH_DATES });
  }

  async findOne(id: number) {
    return this.prisma.validateEntityExists(
      this.prisma.user.findUnique({
        where: { id },
        select: {
          ...USER_SELECT_WITH_DATES,
          teacher: { select: { id: true, subject: true } },
          student: { select: { id: true } },
        },
      }),
      'User',
    );
  }

  async searchByName(name: string) {
    return this.prisma.user.findMany({
      where: nameFilter(name),
      select: USER_SELECT_WITH_DATES,
    });
  }

  async searchByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role: role as any },
      select: USER_SELECT_WITH_DATES,
    });
  }

  async searchByStatus(status: string) {
    return this.prisma.user.findMany({
      where: { status: status as any },
      select: USER_SELECT_WITH_DATES,
    });
  }


  async create(dto: CreateUserDto, photo?: string) {
    const { password, photo: _photo, ...rest } = dto;
    const hashedPassword = await PasswordUtil.hash(password);
    
    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        photo: photo || null,
      },
      select: USER_SELECT_WITH_DATES,
    });
  }

  async update(id: number, dto: UpdateUserDto, photo?: string) {
    await this.prisma.validateEntityExists(
      this.prisma.user.findUnique({ where: { id } }),
      'User',
    );
    const { password, photo: _photo, ...rest } = dto;
    const data: any = { ...rest };
    
    if (password) {
      data.password = await PasswordUtil.hash(password);
    }
    if (photo) {
      data.photo = photo;
    }
    
    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT_WITH_DATES,
    });
  }

  async remove(id: number) {
    await this.prisma.validateEntityExists(
      this.prisma.user.findUnique({ where: { id } }),
      'User',
    );
    return this.prisma.user.delete({ where: { id }, select: { id: true } });
  }
}
