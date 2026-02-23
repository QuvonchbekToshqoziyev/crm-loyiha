import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'Advanced Variables', description: 'Lesson topic' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ example: 'Deep dive into closures and scope chains', description: 'Lesson description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Group ID' })
  @IsOptional()
  @IsInt()
  group_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Teacher ID' })
  @IsOptional()
  @IsInt()
  teacher_id?: number;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'freeze'], description: 'Lesson status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: string;
}
