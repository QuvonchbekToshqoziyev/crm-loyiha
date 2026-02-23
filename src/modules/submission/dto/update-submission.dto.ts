import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSubmissionDto {
  @ApiPropertyOptional({ example: 'Updated solution text...', description: 'Text content of the submission' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '/uploads/homework/updated-solution.pdf', description: 'URL to uploaded file' })
  @IsOptional()
  @IsString()
  file_url?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'freeze'], description: 'Submission status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: string;
}
