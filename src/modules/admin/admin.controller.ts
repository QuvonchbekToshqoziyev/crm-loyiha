import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { createAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';
import { updateAdminDto } from './dto/update-admin.dto';

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly AdminService: AdminService,
  ) {}

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'List all admins', 
    description: 'Retrieve all admin profiles with their user details and assigned groups' 
  })
  @ApiResponse({ status: 200, description: 'List of all admins retrieved successfully' })
  findAll() {
    return this.AdminService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Search admins by name', 
    description: 'Find admins by first name or last name (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for admin name' })
  @ApiResponse({ status: 200, description: 'Matching admins retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.AdminService.searchByName(name);
  }

  @Get('search/by-status')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Filter admins by status', 
    description: 'Get admins filtered by their account status' 
  })
  @ApiQuery({ name: 'status', required: true, enum: ['active', 'inactive', 'freeze'], description: 'admin account status' })
  @ApiResponse({ status: 200, description: 'Filtered admin retrieved successfully' })
  searchByStatus(@Query('status') status: string) {
    return this.AdminService.searchByStatus(status);
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Get Admin by ID', 
    description: 'Retrieve detailed information about a specific Admin' 
  })
  @ApiResponse({ status: 200, description: 'Admin details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.AdminService.findOne(id);
  }

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new admin', 
    description: 'Create a new admin profile. SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Referenced user not found' })
  create(@Body() dto: createAdminDto) {
    return this.AdminService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({
    summary:'Admin status change',
    description: 'Make admin active, inactive or freeze. SuperAdmin only'
  })
  @ApiResponse({status:200, description: "Admin status change success"})
  @ApiResponse({status:404, description: "Admin not found"})
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: updateAdminDto) {
    return this.AdminService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete admin', 
    description: 'Remove admin profile and associated user. SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.AdminService.remove(id);
  }
}
