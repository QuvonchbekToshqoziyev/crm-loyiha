import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: 1, description: 'Homework ID' })
  @IsNotEmpty()
  @IsInt()
  homework_id: number;

  @ApiProperty({ example: 1, description: 'Student ID' })
  @IsNotEmpty()
  @IsInt()
  student_id: number;

  @ApiPropertyOptional({ example: 'My solution to exercise 1...', description: 'Text content of the submission' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '/uploads/homework/solution.pdf', description: 'URL to uploaded file' })
  @IsOptional()
  @IsString()
  file_url?: string;
}
