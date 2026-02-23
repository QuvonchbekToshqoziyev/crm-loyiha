import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Groups')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List all groups', 
    description: 'Retrieve all class groups with course, teacher, room, and student enrollment details' 
  })
  @ApiResponse({ status: 200, description: 'List of all groups retrieved successfully' })
  findAll() {
    return this.groupsService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search groups by name', 
    description: 'Find groups by name (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for group name' })
  @ApiResponse({ status: 200, description: 'Matching groups retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.groupsService.searchByName(name);
  }

  @Get('search/by-course/:courseId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search groups by course', 
    description: 'Get all groups taking a specific course' 
  })
  @ApiResponse({ status: 200, description: 'Groups for course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  searchByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.groupsService.searchByCourse(courseId);
  }

  @Get('search/by-teacher/:teacherId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search groups by teacher', 
    description: 'Get all groups assigned to a specific teacher' 
  })
  @ApiResponse({ status: 200, description: 'Groups for teacher retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  searchByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.groupsService.searchByTeacher(teacherId);
  }

  @Get('search/by-room/:roomId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search groups by room', 
    description: 'Get all groups assigned to a specific room' 
  })
  @ApiResponse({ status: 200, description: 'Groups for room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  searchByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.groupsService.searchByRoom(roomId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get group by ID', 
    description: 'Retrieve detailed information about a specific group including students, course, teacher, and room' 
  })
  @ApiResponse({ status: 200, description: 'Group details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new group', 
    description: 'Create a new class group with course, teacher, and room assignment. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Referenced course, teacher, or room not found' })
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Update group', 
    description: 'Update group information including name, course, teacher, or room. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete group', 
    description: 'Remove a group and all student enrollments. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
