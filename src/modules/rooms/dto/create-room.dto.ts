import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  capacity?: number;
}
