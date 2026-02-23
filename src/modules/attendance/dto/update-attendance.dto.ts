import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: true, description: 'Whether the student attended' })
  @IsOptional()
  @IsBoolean()
  attended?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Whether the student was late' })
  @IsOptional()
  @IsBoolean()
  late?: boolean;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive', 'freeze'], description: 'Attendance record status' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'freeze'])
  status?: string;
}
