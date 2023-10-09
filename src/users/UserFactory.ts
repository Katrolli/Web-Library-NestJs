import { define } from 'typeorm-seeding';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

define(User, () => {
  const hashedPassword = bcrypt.hashSync('asd123', 10);
  const user = new User();
  user.name = 'Admin';
  user.password = hashedPassword;
  user.email = 'admin@example.com';
  user.roleId = 0;
  return user;
});
