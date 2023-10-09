import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInForm: AuthInterface) {
    try {
      return await this.authService.signIn(
        signInForm.email,
        signInForm.password,
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/admin')
  async signInAdmin(@Body() signInForm: AuthInterface) {
    try {
      return await this.authService.singInAdmin(
        signInForm.email,
        signInForm.password,
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
