import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Web Development' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Full stack web development course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '500000.00' })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ example: 6 })
  @IsNotEmpty()
  @IsInt()
  duration_month: number;

  @ApiProperty({ example: 120 })
  @IsNotEmpty()
  @IsInt()
  duration_hours: number;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsNotEmpty()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level: 'beginner' | 'intermediate' | 'advanced';
}
