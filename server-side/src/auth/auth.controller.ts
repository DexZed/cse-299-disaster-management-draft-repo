import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

export class SignInDto {
  email: string;
  password: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const { email, password, role } = signInDto;

      if (!email || !password || !role) {
        throw new HttpException(
          { message: 'Email, password, and role are required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.authService.signIn(email, password, role);
      return {
        message: 'Sign in successful',
        user: result,
      };
    } catch (err) {
      const message = (err as any)?.message || 'Sign in failed';
      throw new HttpException(
        { message, error: message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
