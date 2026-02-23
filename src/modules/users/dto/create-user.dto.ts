import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Role })
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Photo file' })
  @IsOptional()
  photo?: any;
}
