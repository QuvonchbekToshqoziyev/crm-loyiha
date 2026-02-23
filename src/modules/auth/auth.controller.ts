import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user', 
    description: 'Create a new user account with phone, password, and basic information' 
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Phone number already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'User login', 
    description: 'Authenticate with phone number and password to receive JWT token' 
  })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or user not found' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }  
}
