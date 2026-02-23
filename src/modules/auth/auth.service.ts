import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma.service';
import { MailService } from '../../common/email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordUtil } from '../../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await PasswordUtil.hash(dto.password);

    const allowedSelfRegisterRoles = ['STUDENT', 'TEACHER'] as const;
    const role = dto.role && allowedSelfRegisterRoles.includes(dto.role as any)
      ? dto.role
      : 'STUDENT';

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone: dto.phone,
        password: hashedPassword,
        role,
      },
    });

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    await this.mailService.sendMail(dto.email, dto.phone, dto.password);
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        username: user.username, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        phone: user.phone, 
        role: user.role 
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtil.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, phone: user.phone, role: user.role },
    };
  }

  
}
