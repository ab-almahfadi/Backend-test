import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { Gender } from '../entities/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  birthday: Date;

  @IsString()
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsNotEmpty()
  height: number;

  horoscope: string;

  zodiac: string;

  image_profile: string;

  auth_id: string;

  refreshToken: string;

  // @IsString()
  // @IsNotEmpty()
  // password: string;
  // @IsString()
  // @IsNotEmpty()
  // email: string;
}
