import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StudentGroupService } from './studentgroup.service';
import { CreateStudentGroupDto } from './dto/create.studentgroup.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Enrollments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-group')
export class StudentGroupController {
  constructor(private readonly studentGroupService: StudentGroupService) {}

  @Get('group/:groupId/students')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List students in group', 
    description: 'Get all students enrolled in a specific group with their details' 
  })
  @ApiResponse({ status: 200, description: 'List of students retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getStudentsByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.studentGroupService.getStudentsByGroup(groupId);
  }

  @Get('student/:studentId/groups')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List student enrollments', 
    description: 'Get all groups that a student is enrolled in' 
  })
  @ApiResponse({ status: 200, description: 'List of groups retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  getGroupsByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentGroupService.getGroupsByStudent(studentId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Enroll student in group', 
    description: 'Add a student to a group. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Student successfully enrolled in group' })
  @ApiResponse({ status: 400, description: 'Student already enrolled in this group' })
  @ApiResponse({ status: 404, description: 'Student or group not found' })
  addStudentToGroup(@Body() dto: CreateStudentGroupDto) {
    return this.studentGroupService.addStudentToGroup(dto);
  }

  @Delete('student/:studentId/group/:groupId')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Remove student from group', 
    description: 'Unenroll a student from a specific group. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Student successfully removed from group' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  removeStudentFromGroup(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.studentGroupService.removeStudentFromGroup(studentId, groupId);
  }
}
