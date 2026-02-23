import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';
import { multerConfig } from '../../common/config/multer.config';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'List all users', 
    description: 'Retrieve all user accounts with role and profile details. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'List of all users retrieved successfully' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/by-name')
  @ApiOperation({ 
    summary: 'Search users by name', 
    description: 'Find users by first name or last name (case-insensitive partial match). Admin/SuperAdmin only.' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for user name' })
  @ApiResponse({ status: 200, description: 'Matching users retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.usersService.searchByName(name);
  }

  @Get('search/by-role')
  @ApiOperation({ 
    summary: 'Filter users by role', 
    description: 'Get users filtered by their system role. Admin/SuperAdmin only.' 
  })
  @ApiQuery({ name: 'role', required: true, enum: ['SUPERADMIN', 'ADMIN', 'TEACHER', 'STUDENT'], description: 'User role' })
  @ApiResponse({ status: 200, description: 'Filtered users retrieved successfully' })
  searchByRole(@Query('role') role: string) {
    return this.usersService.searchByRole(role);
  }

  @Get('search/by-status')
  @ApiOperation({ 
    summary: 'Filter users by status', 
    description: 'Get users filtered by their account status. Admin/SuperAdmin only.' 
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'User account status' })
  @ApiResponse({ status: 200, description: 'Filtered users retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.usersService.searchByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID', 
    description: 'Retrieve detailed information about a specific user. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create new user', 
    description: 'Create a new user account with optional photo upload. Admin/SuperAdmin only.' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or duplicate phone number' })
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  create(@Body() dto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
    return this.usersService.create(dto, file?.filename);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update user', 
    description: 'Update user account information with optional photo upload. Admin/SuperAdmin only.' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
    return this.usersService.update(id, dto, file?.filename);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete user', 
    description: 'Remove user account and all associated profiles. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
