import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class createAdminDto {

  @ApiProperty({ example: 1, description: 'User ID to link this teacher to' })
  @IsNotEmpty()
  @IsInt()
  user_id!: number;
}
