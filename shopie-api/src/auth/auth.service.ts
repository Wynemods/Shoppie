/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private resetTokens: Map<string, string> = new Map(); // token -> email

  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      return null;
    }
    // Create new user
    const user = await this.usersService.create(registerDto);
    return user;
  }

  async login(loginDto: LoginDto) {
    // Validate user credentials
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      return null;
    }
    // For simplicity, assume password matches (implement hashing in real app)
    if (user.password !== loginDto.password) {
      return null;
    }
    // Return dummy token
    return 'dummy-jwt-token';
  }

  async passwordReset(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return false;
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    this.resetTokens.set(token, email);

    // Create reusable transporter object using Gmail SMTP transport
    // Use environment variables for email and password
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      debug: true,
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Shopie App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  async passwordResetConfirm(token: string, newPassword: string): Promise<boolean> {
    const email = this.resetTokens.get(token);
    if (!email) {
      return false;
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return false;
    }

    const updatedUser = await this.usersService.updatePassword(email, newPassword);
    if (!updatedUser) {
      return false;
    }

    // Invalidate the token
    this.resetTokens.delete(token);

    return true;
  }
}
