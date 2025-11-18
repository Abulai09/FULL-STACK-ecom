import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class userDto {
  @IsString()
  @MinLength(3, { message: 'min 3' })
  username: string;

  @IsPhoneNumber('KZ')
  @MinLength(11, { message: 'min 11' })
  phoneNumber: string;

  @IsString()
  @MinLength(3, { message: 'min 3' })
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'min 3' })
  role?: string;
}
