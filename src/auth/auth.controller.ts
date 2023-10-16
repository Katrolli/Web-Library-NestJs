import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface, UpdateUser } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInForm: AuthInterface) {
    return await this.authService.signIn(signInForm.email, signInForm.password);
  }

  @Post('update/:id')
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUser) {
    try {
      return await this.authService.updateUser(id, payload);
    } catch (err) {
      console.log(err);
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
