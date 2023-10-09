import { IsDefined, IsString } from 'class-validator';

export class CategoryInterface {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  description: string;
}
