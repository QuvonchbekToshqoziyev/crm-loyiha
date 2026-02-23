import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto {
  @ApiPropertyOptional({ example: 'Group B' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1, description: 'Course ID' })
  @IsOptional()
  @IsInt()
  course_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Teacher ID' })
  @IsOptional()
  @IsInt()
  teacher_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'Room ID' })
  @IsOptional()
  @IsInt()
  room_id?: number;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'freeze'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: 'active' | 'inactive' | 'freeze';
}
