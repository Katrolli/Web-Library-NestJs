import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookInterface } from './Dto/book.interface';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { deleteImage } from './helper/removeImage';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(user: any, book: Partial<BookInterface>): Promise<Book> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: book.category },
      });

      const newBook = await this.bookRepository.save({
        ...book,
        createdBy: user.name,
        authorId: user.userId,
        category: category,
      });

      const bookWithRelation = await this.bookRepository.findOne({
        where: { id: newBook.id },
        relations: { category: true, author: true },
      });

      return bookWithRelation;
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

  async update(
    id: string,
    payload: Partial<BookInterface> & Partial<{ authorId: string }>,
  ): Promise<Book> {
    const author = payload.authorId;
    try {
      let book = await this.bookRepository.findOne({
        where: { id },
        relations: { category: true, author: true },
      });
      if (!book) {
        throw new Error('Book not found');
      }
      const newCategory = await this.categoryRepository.findOne({
        where: { name: payload.category },
      });

      if (!newCategory) {
        throw new Error('Category not found');
      }

      const newAuthor = await this.userRepository.findOne({
        where: { name: author },
      });
      if (!newAuthor) {
        throw new Error('Author not found');
      }

      book = { ...book, ...payload, author: newAuthor, category: newCategory };
      const updatedBook = await this.bookRepository.save({
        ...book,
      });

      delete updatedBook.author.password;
      return updatedBook;
    } catch (err) {
      throw 'failed to update Book ' + err.message;
    }
  }

  async remove(id: string) {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      deleteImage(book.imageUrl);
      return await this.bookRepository.delete(id);
    } catch (err) {
      throw 'Failed to remove book with id ' + id;
    }
  }
}
