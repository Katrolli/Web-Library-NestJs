import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  BadRequestException,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UserCreatePayload } from './Dto/user.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() payload: UserCreatePayload) {
    try {
      if (payload.roleId === 0) {
        throw new UnauthorizedException('You cannot create an admin user');
      }
      const user = await this.usersService.create(payload);
      return { success: 1, data: user };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('/admin')
  @ApiBody({ type: UserCreatePayload })
  async getAdmin(
    @Req() request: Request,
    @Body() payload: Partial<UserCreatePayload>,
  ) {
    try {
      if (!request['user'] && request['user'].roleId !== 0) {
        throw new UnauthorizedException('you are not an admin');
      }
      return await this.usersService.getAdmin(payload.email);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  // @UseGuards(AuthGuard)
  @Get()
  async findAllUsers() {
    try {
      return await this.usersService.findAll();
    } catch (err) {
      new BadRequestException(err);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (err) {
      new BadRequestException(err);
    }
  }

  @Patch(':id')
  @ApiBody({ type: UserCreatePayload })
  async updateUser(
    @Param('id') id: string,
    @Body() payload: Partial<UserCreatePayload>,
  ) {
    try {
      return await this.usersService.update(id, payload);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
