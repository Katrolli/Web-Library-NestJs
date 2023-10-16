import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUser } from './auth.interface';
import { UserCreatePayload } from 'src/users/Dto/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No user found');
    }
    if (user.roleId == 0) {
      throw new BadRequestException('Wrong section');
    }
    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Password mismatch');
    }
    const payload = { userId: user.id, role: user.roleId, name: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async singInAdmin(email: string, pass: string) {
    try {
      const admin = await this.userService.getAdmin(email);
      if (!admin) {
        throw new UnauthorizedException('No admin found');
      }
      const isValid = await bcrypt.compare(pass, admin.password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid Password');
      }
      const payload = {
        userId: admin.id,
        roleId: admin.roleId,
        name: admin.name,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      throw 'In auth service error: ' + err;
    }
  }

  async updateUser(id: string, payload: UpdateUser) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new UnauthorizedException('No user found');
      }
      const newHashedPassword = await bcrypt.hash(payload.password, 10);

      const updatePayload: Partial<UserCreatePayload> = {
        name: payload.name,
        password: newHashedPassword,
      };

      const updatedUser = await this.userService.update(id, updatePayload);
      return updatedUser;
    } catch (err) {
      throw 'In auth service user update error: ' + err;
    }
  }
}
