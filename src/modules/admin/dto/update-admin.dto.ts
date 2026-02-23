import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class updateAdminDto {
    @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'freeze'] })
    @IsEnum(['active', 'inactive', 'freeze'])
    @IsNotEmpty()
    admin_status!: 'active' | 'inactive' | 'freeze';
}