import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 1, description: 'User ID to link this student to' })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
