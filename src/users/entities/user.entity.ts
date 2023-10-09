import { Book } from 'src/books/entities/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ update: false })
  roleId: number;

  @CreateDateColumn({ update: false })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  // user must have updatedAt date
}
