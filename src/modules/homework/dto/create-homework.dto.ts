import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Chapter 3 Exercises', description: 'Homework title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Complete exercises 1-10 from chapter 3', description: 'Homework description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-03-01T23:59:00Z', description: 'Due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiProperty({ example: 1, description: 'Lesson ID' })
  @IsNotEmpty()
  @IsInt()
  lesson_id: number;
}
