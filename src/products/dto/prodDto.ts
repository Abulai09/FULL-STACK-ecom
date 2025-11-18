import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class productDto {
  @IsString()
  name: string;
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsString()
  category: string;
}
