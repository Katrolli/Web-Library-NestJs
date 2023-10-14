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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookInterface } from './Dto/book.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './src/books/images',
        filename: (req, file, cb) => {
          try {
            cb(null, `${file.originalname}`);
          } catch (err) {
            console.error('File saving error', err);
            cb(err, null);
          }
        },
      }),
    }),
  )
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: BookInterface,
    @Req() request: Request,
  ) {
    try {
      const user = request['user'];
      if (user.role !== 0 && user.role !== 1) {
        throw 'You cannot create a book';
      }
      const imageUrl = `${file.filename}`;
      payload.imageUrl = imageUrl;

      const book = await this.booksService.create(user, payload);

      return book;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  @Get()
  async findAll() {
    try {
      return this.booksService.findAll();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './src/books/images',
        filename: (req, file, cb) => {
          try {
            cb(null, `${file.originalname}`);
          } catch (err) {
            console.error('File saving error', err);
            cb(err, null);
          }
        },
      }),
    }),
  )
  @Patch(':id')
  @ApiBody({ type: BookInterface })
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() payload: Partial<BookInterface>,
  ) {
    const imageUrl = `${file.filename}`;
    payload.imageUrl = imageUrl;
    return this.booksService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.booksService.remove(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
