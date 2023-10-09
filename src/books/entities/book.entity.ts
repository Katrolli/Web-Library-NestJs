import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  imageUrl: string;

  @Column()
  createdBy: string;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  author: User;
  @JoinColumn({ name: 'authorId' })
  @Column()
  authorId: string;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'CASCADE',
  })
  category: Category;
  @JoinColumn({ name: 'categoryId' })
  @Column()
  categoryId: string;
}
