import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Grades')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
  ) {}


  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'List all grades',
    description: 'Retrieve all grades with submission, student, and teacher details',
  })
  @ApiResponse({ status: 200, description: 'List of all grades retrieved successfully' })
  findAll() {
    return this.gradeService.findAll();
  }

  @Get('search/by-submission/:submissionId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get grade by submission',
    description: 'Retrieve the grade for a specific submission',
  })
  @ApiResponse({ status: 200, description: 'Grade for submission retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  searchBySubmission(@Param('submissionId', ParseIntPipe) submissionId: number) {
    return this.gradeService.searchBySubmission(submissionId);
  }

  @Get('search/by-student/:studentId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get grades by student',
    description: 'Retrieve all grades for a specific student',
  })
  @ApiResponse({ status: 200, description: 'Grades for student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  searchByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradeService.searchByStudent(studentId);
  }

  @Get('search/by-teacher/:teacherId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Get grades by teacher',
    description: 'Retrieve all grades given by a specific teacher',
  })
  @ApiResponse({ status: 200, description: 'Grades by teacher retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  searchByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.gradeService.searchByTeacher(teacherId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get grade by ID',
    description: 'Retrieve a specific grade with full details',
  })
  @ApiResponse({ status: 200, description: 'Grade details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradeService.findOne(id);
  }


  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Grade a submission',
    description: 'Assign a grade to a homework submission. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 201, description: 'Grade created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or submission already graded' })
  @ApiResponse({ status: 404, description: 'Submission or teacher not found' })
  create(@Body() dto: CreateGradeDto) {
    return this.gradeService.create(dto);
  }


  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Update grade',
    description: 'Update a grade. Admin/SuperAdmin/Teacher only.',
  })
  @ApiResponse({ status: 200, description: 'Grade updated successfully' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGradeDto) {
    return this.gradeService.update(id, dto);
  }


  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Delete grade',
    description: 'Remove a grade. Admin/SuperAdmin only.',
  })
  @ApiResponse({ status: 200, description: 'Grade deleted successfully' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradeService.remove(id);
  }
}
