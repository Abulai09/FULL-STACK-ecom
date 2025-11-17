import { IsNumber, IsString } from 'class-validator';

export class productDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;
}
