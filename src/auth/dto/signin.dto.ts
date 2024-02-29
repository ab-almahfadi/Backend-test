import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto extends PartialType(CreateAuthDto) {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
