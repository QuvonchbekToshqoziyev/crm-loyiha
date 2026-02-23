import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List all courses', 
    description: 'Retrieve all available courses with details on duration, price, level, and associated groups' 
  })
  @ApiResponse({ status: 200, description: 'List of all courses retrieved successfully' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search courses by name', 
    description: 'Find courses by name (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for course name' })
  @ApiResponse({ status: 200, description: 'Matching courses retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.coursesService.searchByName(name);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get course by ID', 
    description: 'Retrieve detailed information about a specific course' 
  })
  @ApiResponse({ status: 200, description: 'Course details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new course', 
    description: 'Add a new course to the catalog with pricing, duration, and difficulty level. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or duplicate course name' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Update course', 
    description: 'Update course information including price, duration, level, or description. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete course', 
    description: 'Remove a course from the catalog. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
