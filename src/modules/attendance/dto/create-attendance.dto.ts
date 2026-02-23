import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ example: 1, description: 'Lesson ID' })
  @IsNotEmpty()
  @IsInt()
  lesson_id!: number;

  @ApiProperty({ example: 1, description: 'Student ID' })
  @IsNotEmpty()
  @IsInt()
  student_id!: number;

  @ApiProperty({ example: true, description: 'Whether the student attended' })
  @IsNotEmpty()
  @IsBoolean()
  attended!: boolean;

  @ApiPropertyOptional({ example: 'Late', description: 'Optional note' })
  @IsOptional()
  @IsBoolean()
  late?: boolean;
}
