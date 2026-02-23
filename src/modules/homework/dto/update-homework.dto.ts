import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateHomeworkDto {
  @ApiPropertyOptional({ example: 'Updated Chapter 3 Exercises', description: 'Homework title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description', description: 'Homework description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-03-15T23:59:00Z', description: 'Due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'freeze'], description: 'Homework status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: string;
}
