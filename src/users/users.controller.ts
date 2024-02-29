import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import ResponsePresenter from 'src/presenters/response.presenter';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';
import * as moment from 'moment';
import { UpdateUsersDto } from './dto/update-users.dto';

@Controller()
export class UsersController extends ResponsePresenter {
  constructor(
    private readonly usersService: UsersService
    
    ) {
    super();
  }

  @Post('createProfile')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createProfile(
    @Body() body: CreateUserDto,
    @Req() req,
  ) {
    try {
      body.auth_id = req.user.sub;
      // body.auth_id = req.user.sub;
      console.log(req.user)

      const time = moment(body.birthday).format('MM-DD');
      const [month, day] = time.split('-');
      const getZodiacSign = this.usersService.getZodiacSign(+month, +day);
      if (!getZodiacSign)
        return this.error('Invalid date', HttpStatus.BAD_REQUEST);

      if (getZodiacSign instanceof Object) {
        body.horoscope = getZodiacSign.horoscope;
        body.zodiac = getZodiacSign.zodiac;
      }

      const user = await this.usersService.createUser(body);
      return this.success(user, 'User created', HttpStatus.CREATED);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }

  @Get('getProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getProfile(@Req() req) {
    try {
      const user = await this.usersService.findOne(req.user.sub);
      console.log(user)
      if (!user) return this.error('User not found', HttpStatus.NOT_FOUND);
      return this.success(user, 'User found', HttpStatus.OK);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }

  @Patch('updateProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateProfile(
    @Req() req,
    @Body() body: UpdateUsersDto,
  ) {
    try {
      const user = await this.usersService.findOneAndUpdate(req.user.sub, body);
      console.log(req.user.sub)
      if (body.birthday) {
        const time = moment(body.birthday).format('MM-DD');
        const [month, day] = time.split('-');
        const getZodiacSign = this.usersService.getZodiacSign(+month, +day);
        if (!getZodiacSign)
          return this.error('Invalid date', HttpStatus.BAD_REQUEST);

        if (getZodiacSign instanceof Object) {
          body.horoscope = getZodiacSign.horoscope;
          body.zodiac = getZodiacSign.zodiac;
        }
      }
      return this.success(user, 'User updated', HttpStatus.OK);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }
}
