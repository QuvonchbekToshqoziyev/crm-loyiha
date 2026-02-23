import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}


  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'List all attendance records',
    description: 'Retrieve all attendance records with lesson and student details',
  })
  @ApiResponse({ status: 200, description: 'List of all attendance records retrieved successfully' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('search/by-lesson/:lessonId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Get attendance by lesson',
    description: 'Retrieve all attendance records for a specific lesson',
  })
  @ApiResponse({ status: 200, description: 'Attendance records for lesson retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  searchByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.attendanceService.searchByLesson(lessonId);
  }

  @Get('search/by-student/:studentId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get attendance by student',
    description: 'Retrieve all attendance records for a specific student',
  })
  @ApiResponse({ status: 200, description: 'Attendance records for student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  searchByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.attendanceService.searchByStudent(studentId);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Filter attendance by status',
    description: 'Get attendance records filtered by status',
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Attendance status' })
  @ApiResponse({ status: 200, description: 'Filtered attendance records retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.attendanceService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get attendance record by ID',
    description: 'Retrieve a specific attendance record with full details',
  })
  @ApiResponse({ status: 200, description: 'Attendance record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }


  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Record attendance',
    description: 'Create an attendance record for a student in a lesson. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 201, description: 'Attendance recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or duplicate record' })
  @ApiResponse({ status: 404, description: 'Lesson or student not found' })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }


  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Update attendance record',
    description: 'Update an attendance record. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, dto);
  }


  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Delete attendance record',
    description: 'Remove an attendance record. Admin/SuperAdmin only.',
  })
  @ApiResponse({ status: 200, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}
