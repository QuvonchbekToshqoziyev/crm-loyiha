import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Rooms')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'List all rooms', 
    description: 'Retrieve all available rooms with capacity and assignment information' 
  })
  @ApiResponse({ status: 200, description: 'List of all rooms retrieved successfully' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('search/by-name')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search rooms by name', 
    description: 'Find rooms by name or identifier (case-insensitive partial match)' 
  })
  @ApiQuery({ name: 'name', required: true, type: String, description: 'Search term for room name' })
  @ApiResponse({ status: 200, description: 'Matching rooms retrieved successfully' })
  searchByName(@Query('name') name: string) {
    return this.roomsService.searchByName(name);
  }

  @Get('search/by-capacity')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Search rooms by capacity', 
    description: 'Find rooms within a specified capacity range' 
  })
  @ApiQuery({ name: 'minCapacity', required: true, type: Number, description: 'Minimum capacity' })
  @ApiQuery({ name: 'maxCapacity', required: false, type: Number, description: 'Maximum capacity (optional)' })
  @ApiResponse({ status: 200, description: 'Matching rooms retrieved successfully' })
  searchByCapacity(@Query('minCapacity') minCapacity: number, @Query('maxCapacity') maxCapacity?: number) {
    return this.roomsService.searchByCapacity(+minCapacity, maxCapacity ? +maxCapacity : undefined);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ 
    summary: 'Get room by ID', 
    description: 'Retrieve detailed information about a specific room including assigned groups' 
  })
  @ApiResponse({ status: 200, description: 'Room details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Create new room', 
    description: 'Add a new room to the facility inventory. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or duplicate room name' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Update room', 
    description: 'Update room information including name, capacity, or status. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ 
    summary: 'Delete room', 
    description: 'Remove a room from the facility inventory. Admin/SuperAdmin only.' 
  })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
