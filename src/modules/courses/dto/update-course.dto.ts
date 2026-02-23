import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'freeze'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: 'active' | 'inactive' | 'freeze';
}
