import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGradeDto {
  @ApiProperty({ example: 1, description: 'Submission ID to grade' })
  @IsNotEmpty()
  @IsInt()
  submission_id: number;

  @ApiProperty({ example: 85.5, description: 'Grade value' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  grade: number;

  @ApiPropertyOptional({ example: 'Good work, but needs improvement on section 2', description: 'Optional comment' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 1, description: 'Teacher ID who graded (graded_by)' })
  @IsNotEmpty()
  @IsInt()
  graded_by_id: number;
}
