import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreatePayload } from './Dto/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: UserCreatePayload): Promise<User> {
    try {
      const { password } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.save({
        ...user,
        roleId: 1,
        password: hashedPassword,
      });
      return newUser;
    } catch (err) {
      console.log(err);
      throw 'Failed user creation: ';
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({ relations: { books: true } });
    } catch (err) {
      throw 'Failed to find all users';
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (err) {
      throw 'Failed to find user with id: ' + id;
    }
  }

  async getAdmin(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw 'Failed to find user with email: ' + email;
      }
      if (user.roleId != 0) {
        throw 'You are not an admin';
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email: email },
      });
    } catch (err) {
      throw 'Failed to find user with email: ' + email;
    }
  }

  async update(id: string, payload: Partial<UserCreatePayload>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      return this.userRepository.save({ ...user, ...payload });
    } catch (err) {
      throw 'Failed updating user';
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepository.delete(id);
    } catch (err) {
      console.log(err);
      throw 'Failed deleting user with id: ' + id;
    }
  }
}
