import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookInterface } from './Dto/book.interface';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(user, book: BookInterface): Promise<Book> {
    try {
      // const author = await this.userRepository.findOne({
      //   where: { id: userId },
      // });
      const category = await this.categoryRepository.findOne({
        where: { name: book.category },
      });

      const newBook = await this.bookRepository.save({
        ...book,
        createdBy: user.name,
        authorId: user.userId,
        category: category,
      });

      return newBook;
    } catch (err) {
      console.log(err);
      throw 'Failed to create book with err ' + err.message;
    }
  }

  async findAll() {
    try {
      return await this.bookRepository.find({
        relations: { author: true, category: true },
      });
    } catch (err) {
      console.log(err);
      throw 'Failed to find all Books';
    }
  }

  async findOne(id: string) {
    try {
      return await this.bookRepository.findOne({
        where: { id: id },
        relations: { author: true, category: true },
      });
    } catch (err) {
      throw 'Failed to find Book';
    }
  }

  async update(id: string, payload: Partial<BookInterface>): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id },
        relations: { category: true, author: true },
      });
      const newCategory = await this.categoryRepository.findOne({
        where: { name: payload.category },
      });
      const updatedBook = await this.bookRepository.save({
        ...book,
        ...payload,
        category: newCategory,
      });
      delete updatedBook.author.password;
      return updatedBook;
    } catch (err) {
      throw 'failed to update Book' + err.message;
    }
  }

  async remove(id: string) {
    try {
      return await this.bookRepository.delete(id);
    } catch (err) {
      throw 'Failed to remove book with id ' + id;
    }
  }
}
