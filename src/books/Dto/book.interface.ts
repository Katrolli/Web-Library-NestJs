import { IsDefined, IsString } from 'class-validator';

export class BookInterface {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  description: string;

  imageUrl: string;

  @IsDefined()
  @IsString()
  category: string;
}
