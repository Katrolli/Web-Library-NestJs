import { Injectable } from '@nestjs/common';
import { CategoryInterface } from './Dto/category.interface';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(payload: CategoryInterface): Promise<Category> {
    try {
      return await this.categoryRepository.save(payload);
    } catch (err) {
      throw 'Error creating category';
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (err) {
      throw 'Error getting all categories' + err.message;
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      return await this.categoryRepository.findOne({
        where: { id },
        relations: { books: true },
      });
    } catch (err) {
      throw 'Error getting one category' + err.message;
    }
  }

  async update(id: string, payload: CategoryInterface): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      return await this.categoryRepository.save({
        ...category,
        ...payload,
      });
    } catch (err) {
      throw 'Error updating category' + err.message;
    }
  }

  async remove(id: string) {
    try {
      return await this.categoryRepository.delete(id);
    } catch (err) {
      throw ' error deleting category' + err.message;
    }
  }
}
