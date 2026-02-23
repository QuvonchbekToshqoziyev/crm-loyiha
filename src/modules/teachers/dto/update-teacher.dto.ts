import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTeacherDto {
  @ApiPropertyOptional({ example: 'Mathematics' })
  @IsOptional()
  @IsString()
  subject?: string;
}
