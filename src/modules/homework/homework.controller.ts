import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Homework')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('homework')
export class HomeworkController {
  constructor(
    private readonly homeworkService: HomeworkService,
  ) {}


  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'List all homework',
    description: 'Retrieve all homework assignments with lesson details',
  })
  @ApiResponse({ status: 200, description: 'List of all homework retrieved successfully' })
  findAll() {
    return this.homeworkService.findAll();
  }

  @Get('search/by-title')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Search homework by title',
    description: 'Find homework by title (case-insensitive partial match)',
  })
  @ApiQuery({ name: 'title', required: true, type: String, description: 'Search term for homework title' })
  @ApiResponse({ status: 200, description: 'Matching homework retrieved successfully' })
  searchByTitle(@Query('title') title: string) {
    return this.homeworkService.searchByTitle(title);
  }

  @Get('search/by-lesson/:lessonId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get homework by lesson',
    description: 'Retrieve all homework for a specific lesson',
  })
  @ApiResponse({ status: 200, description: 'Homework for lesson retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  searchByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.homeworkService.searchByLesson(lessonId);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Filter homework by status',
    description: 'Get homework filtered by status',
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Homework status' })
  @ApiResponse({ status: 200, description: 'Filtered homework retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.homeworkService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get homework by ID',
    description: 'Retrieve detailed information about a specific homework',
  })
  @ApiResponse({ status: 200, description: 'Homework details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Homework not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.findOne(id);
  }


  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Create homework',
    description: 'Assign homework for a lesson. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 201, description: 'Homework created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  create(@Body() dto: CreateHomeworkDto) {
    return this.homeworkService.create(dto);
  }


  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Update homework',
    description: 'Update homework information. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 200, description: 'Homework updated successfully' })
  @ApiResponse({ status: 404, description: 'Homework not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHomeworkDto) {
    return this.homeworkService.update(id, dto);
  }


  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Delete homework',
    description: 'Remove a homework assignment. Admin/SuperAdmin only.',
  })
  @ApiResponse({ status: 200, description: 'Homework deleted successfully' })
  @ApiResponse({ status: 404, description: 'Homework not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.remove(id);
  }
}
