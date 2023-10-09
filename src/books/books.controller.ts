import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookInterface } from './Dto/book.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() payload: BookInterface, @Req() request: Request) {
    try {
      const user = request['user']?.payload;
      if (user.role !== 0 && user.role !== 1) {
        throw 'You cannot create a book';
      }

      const book = await this.booksService.create(user, payload);

      return book;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      return this.booksService.findAll();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBody({ type: BookInterface })
  update(@Param('id') id: string, @Body() payload: Partial<BookInterface>) {
    return this.booksService.update(id, payload);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.booksService.remove(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
