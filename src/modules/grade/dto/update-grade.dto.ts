import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGradeDto {
  @ApiPropertyOptional({ example: 90.0, description: 'Updated grade value' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  grade?: number;

  @ApiPropertyOptional({ example: 'Revised: excellent improvement', description: 'Updated comment' })
  @IsOptional()
  @IsString()
  comment?: string;
}
