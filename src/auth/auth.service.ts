/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    return result;
  }

  async login(loginDto: { username: string; password: string }): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user;
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user: result, accessToken };
  }

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.password !== oldPassword) {
      throw new UnauthorizedException('Old password does not match, be serous with me brother, nkt');
    }
    user.password = newPassword;
    return 'Password changed successfully, make sure not to forget it again😂😂';
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      type JwtPayload = { username: string; sub: string };
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const newToken = this.jwtService.sign({ username: payload.username, sub: payload.sub });
      return newToken;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
