import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @ApiPropertyOptional({ example: 'Mathematics' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 1, description: 'User ID to link this teacher to' })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
