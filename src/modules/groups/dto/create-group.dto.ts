import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Course ID' })
  @IsNotEmpty()
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 1, description: 'Teacher ID' })
  @IsNotEmpty()
  @IsInt()
  teacher_id: number;

  @ApiPropertyOptional({ example: 1, description: 'Room ID' })
  @IsOptional()
  @IsInt()
  room_id?: number;
}
