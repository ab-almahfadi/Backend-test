import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/signin.dto';
import ResponsePresenter from 'src/presenters/response.presenter';
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthController extends ResponsePresenter {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      return await this.authService.create(createAuthDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDto) {
    try {
      if (!body.email && !body.password) {
        return this.error(
          'Email and password are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.authService.signIn(body);
      if (!user) {
        return this.error('User not found', HttpStatus.NOT_FOUND);
      }
      // console.log(user)
      // const isMatch = await bcrypt.compare(body.password, user.password);
      // if (!isMatch) {
      //   return this.error('Invalid password', HttpStatus.UNAUTHORIZED);
      // }
      const token = await this.authService.getTokens(user.user.auth_id.toString(), user.user.email);
      return this.success(token, 'Login success');
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }
}
