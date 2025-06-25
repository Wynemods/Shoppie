/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    if (!user) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Registration successful' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { accessToken: token };
  }

  @Post('password-reset')
  async passwordReset(@Body() passwordResetDto: PasswordResetDto) {
    const result = await this.authService.passwordReset(passwordResetDto.email);
    if (!result) {
      throw new HttpException('Password reset failed', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Password reset email sent' };
  }

  @Post('password-reset/confirm')
  async passwordResetConfirm(@Body() passwordResetConfirmDto: PasswordResetConfirmDto) {
    const result = await this.authService.passwordResetConfirm(passwordResetConfirmDto.token, passwordResetConfirmDto.newPassword);
    if (!result) {
      throw new HttpException('Password reset confirmation failed', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Password has been reset successfully' };
  }
}
