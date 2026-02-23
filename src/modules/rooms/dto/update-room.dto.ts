import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'freeze'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: 'active' | 'inactive' | 'freeze';
}
