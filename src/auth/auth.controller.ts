/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: Omit<User, 'password'> }): Omit<User, 'password'> {
    return req.user;
  }

  @Post('login')
  async login(
    @Body() loginDto: { username: string; password: string }
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const loginResult = await this.authService.login(loginDto);
    return loginResult;
  }

  @Post('logout')
  logout(): Promise<{ message: string }> {
  
    return Promise.resolve({ message: 'Logout successful' });
  }

  @Post('password-reset')
  passwordReset(@Body('email') email: string): Promise<{ message: string }> {
    
    return Promise.resolve({ message: `Password reset link sent to ${email} (simulated)` });
  }

  @Post('change-password')
  async changePassword(
    @Body() body: { username: string; oldPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    const { username, oldPassword, newPassword } = body;
    const result = await this.authService.changePassword(username, oldPassword, newPassword);
    return { message: result };
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    const newToken = await this.authService.refreshToken(refreshToken);
    return { accessToken: newToken };
  }
}
