import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to Variables', description: 'Lesson topic' })
    @IsNotEmpty()
    @IsString()
    topic!: string;

  @ApiPropertyOptional({ example: 'Covering variable types, scope, and hoisting', description: 'Lesson description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'Group ID' })
  @IsNotEmpty()
  @IsInt()
  group_id: number;

  @ApiPropertyOptional({ example: 1, description: 'Teacher ID (optional, defaults to group teacher)' })
  @IsOptional()
  @IsInt()
  teacher_id?: number;
}
