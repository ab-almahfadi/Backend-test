import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-users.dto';
import { IZodiac } from 'src/constants/constants';
import { UpdateUsersDto } from './dto/update-users.dto';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { Auth, AuthDocument } from 'src/auth/entities/auth.entity';
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async create(createAuthDto: CreateAuthDto): Promise<any> {
    const user = new this.authModel(createAuthDto);
    return user.save();
  }

  async findOne(auth_id: string): Promise<UserDocument> {
    const user = this.userModel
      .findOne({ auth_id: auth_id })
      .populate('auth_id')
      .select('+password')
      .exec();
    return user;
  }

  async findById(auth_id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(auth_id).exec()

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    return user
  }

  async findOneAndUpdate(auth_id: string, data: UpdateUsersDto) {
    return this.userModel.findOneAndUpdate({ auth_id }, { ...data });
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.authModel.findOne({ email })
  }


  async update(auth_id: string, updateUserDto: UpdateUsersDto): Promise<AuthDocument>  {
    const user = await this.authModel.findByIdAndUpdate(auth_id, updateUserDto, { new: true }).exec()

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    return user
}

  async update1(auth_id: string, UpdateAuthDto: UpdateAuthDto): Promise<AuthDocument>  {
    const user = await this.authModel.findByIdAndUpdate(auth_id, UpdateAuthDto, { new: true }).exec()

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    return user
  }

  getZodiacSign(month: number, day: number): IZodiac | boolean {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return {
        horoscope: 'Aries',
        zodiac: 'Ram',
      };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return {
        horoscope: 'Taurus',
        zodiac: 'Bull',
      };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      return {
        horoscope: 'Gemini',
        zodiac: 'Twins',
      };
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      return {
        horoscope: 'Cancer',
        zodiac: 'Crab',
      };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return {
        horoscope: 'Leo',
        zodiac: 'Lion',
      };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return {
        horoscope: 'Virgo',
        zodiac: 'Virgin',
      };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
      return {
        horoscope: 'Libra',
        zodiac: 'Balance',
      };
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
      return {
        horoscope: 'Scorpio',
        zodiac: 'Scorpion',
      };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return {
        horoscope: 'Sagittarius',
        zodiac: 'Archer',
      };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return {
        horoscope: 'Capricorn',
        zodiac: 'Goat',
      };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return {
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return {
        horoscope: 'Pisces',
        zodiac: 'Fish',
      };
    }

    return false;
  }
}
