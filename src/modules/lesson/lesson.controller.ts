import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Lessons')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'List all lessons',
    description: 'Retrieve all lessons with group and teacher details. Supports optional pagination.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'List of all lessons retrieved successfully' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.lessonService.findAll(
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get('search/by-topic')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Search lessons by topic',
    description: 'Find lessons by topic name (case-insensitive partial match)',
  })
  @ApiQuery({ name: 'topic', required: true, type: String, description: 'Search term for lesson topic' })
  @ApiResponse({ status: 200, description: 'Matching lessons retrieved successfully' })
  searchByTopic(@Query('topic') topic: string) {
    return this.lessonService.searchByTopic(topic);
  }

  @Get('search/by-group/:groupId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Search lessons by group',
    description: 'Get all lessons for a specific group',
  })
  @ApiResponse({ status: 200, description: 'Lessons for group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  searchByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.lessonService.searchByGroup(groupId);
  }

  @Get('search/by-teacher/:teacherId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Search lessons by teacher',
    description: 'Get all lessons assigned to a specific teacher',
  })
  @ApiResponse({ status: 200, description: 'Lessons for teacher retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  searchByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.lessonService.searchByTeacher(teacherId);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Filter lessons by status',
    description: 'Get lessons filtered by their status',
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Lesson status' })
  @ApiResponse({ status: 200, description: 'Filtered lessons retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.lessonService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get lesson by ID',
    description: 'Retrieve detailed information about a specific lesson',
  })
  @ApiResponse({ status: 200, description: 'Lesson details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Create new lesson',
    description: 'Create a new lesson for a group. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Referenced group or teacher not found' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Update lesson',
    description: 'Update lesson information. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Delete lesson',
    description: 'Remove a lesson. Admin/SuperAdmin only.',
  })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.remove(id);
  }
}
