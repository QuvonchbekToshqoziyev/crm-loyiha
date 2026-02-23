import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Teachers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List all teachers', 
    description: 'Retrieve all teacher profiles with their user details and assigned groups' 
  })
  @ApiResponse({ status: 200, description: 'List of all teachers retrieved successfully' })
  findAll() {
    return this.teachersService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search teachers by name', 
    description: 'Find teachers by first name or last name (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for teacher name' })
  @ApiResponse({ status: 200, description: 'Matching teachers retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.teachersService.searchByName(name);
  }

  @Get('search/by-subject')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search teachers by subject', 
    description: 'Find teachers who specialize in a specific subject area' 
  })
  @ApiQuery({ name: 'subject', required: true, type: String, description: 'Subject specialization' })
  @ApiResponse({ status: 200, description: 'Matching teachers retrieved successfully' })
  searchBySubject(@Query('subject') subject: string) {
    return this.teachersService.searchBySubject(subject);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Filter teachers by status', 
    description: 'Get teachers filtered by their account status' 
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Teacher account status' })
  @ApiResponse({ status: 200, description: 'Filtered teachers retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.teachersService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get teacher by ID', 
    description: 'Retrieve detailed information about a specific teacher' 
  })
  @ApiResponse({ status: 200, description: 'Teacher details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new teacher', 
    description: 'Create a new teacher profile. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Referenced user not found' })
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Update teacher', 
    description: 'Update teacher profile information. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete teacher', 
    description: 'Remove teacher profile and associated user. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.remove(id);
  }
}
