import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from './users/entities/user.entity';

export default class CreateAdmin implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    console.log('Running the seeder...');
    const users = await factory(User)().createMany(1);
    console.log('Created users:', users);
  }
}
