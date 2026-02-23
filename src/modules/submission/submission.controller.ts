import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
  ) {}


  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'List all submissions',
    description: 'Retrieve all homework submissions with homework, student, and grade details',
  })
  @ApiResponse({ status: 200, description: 'List of all submissions retrieved successfully' })
  findAll() {
    return this.submissionService.findAll();
  }

  @Get('search/by-homework/:homeworkId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Get submissions by homework',
    description: 'Retrieve all submissions for a specific homework assignment',
  })
  @ApiResponse({ status: 200, description: 'Submissions for homework retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Homework not found' })
  searchByHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
    return this.submissionService.searchByHomework(homeworkId);
  }

  @Get('search/by-student/:studentId')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get submissions by student',
    description: 'Retrieve all submissions by a specific student',
  })
  @ApiResponse({ status: 200, description: 'Submissions for student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  searchByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.submissionService.searchByStudent(studentId);
  }

  @Get('search/by-status')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Filter submissions by status',
    description: 'Get submissions filtered by status',
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'Submission status' })
  @ApiResponse({ status: 200, description: 'Filtered submissions retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.submissionService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get submission by ID',
    description: 'Retrieve a specific submission with full details including grade',
  })
  @ApiResponse({ status: 200, description: 'Submission details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.findOne(id);
  }


  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Submit homework',
    description: 'Submit a homework assignment. Students can submit their own homework.',
  })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or duplicate submission' })
  @ApiResponse({ status: 404, description: 'Homework or student not found' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }


  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Update submission',
    description: 'Update a homework submission.',
  })
  @ApiResponse({ status: 200, description: 'Submission updated successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }


  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({
    summary: 'Delete submission',
    description: 'Remove a homework submission. Admin/SuperAdmin only.',
  })
  @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.submissionService.remove(id);
  }
}
