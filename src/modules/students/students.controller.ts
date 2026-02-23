import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List all students', 
    description: 'Retrieve all students with their user details and group enrollments' 
  })
  @ApiResponse({ status: 200, description: 'List of all students retrieved successfully' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search students by name', 
    description: 'Find students by first name or last name (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for student name' })
  @ApiResponse({ status: 200, description: 'Matching students retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.studentsService.searchByName(name);
  }

  @Get('search/by-group/:groupId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search students by group', 
    description: 'Get all students enrolled in a specific group' 
  })
  @ApiResponse({ status: 200, description: 'Students in group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  searchByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.studentsService.searchByGroup(groupId);
  }

  @Get('search/by-course/:courseId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search students by course', 
    description: 'Get all students enrolled in groups taking a specific course' 
  })
  @ApiResponse({ status: 200, description: 'Students in course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  searchByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.studentsService.searchByCourse(courseId);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Filter students by status', 
    description: 'Get students filtered by their account status' 
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Student account status' })
  @ApiResponse({ status: 200, description: 'Filtered students retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.studentsService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get student by ID', 
    description: 'Retrieve detailed information about a specific student' 
  })
  @ApiResponse({ status: 200, description: 'Student details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new student', 
    description: 'Create a new student profile. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Referenced user not found' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Update student', 
    description: 'Update student profile information. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete student', 
    description: 'Remove student profile and associated user. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
