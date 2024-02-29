import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './entities/auth.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2'
import JwtPayload from './jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private usersService: UsersService,
    // private authService: AuthService, // This is incorrect
    private configService: ConfigService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<any> {

    const user = await this.usersService.findByEmail(createAuthDto.email)

    if(user) throw new BadRequestException('User already exists')

    const hash = await this.hashData(createAuthDto.password)
    const newUser = await this.usersService.create({
        ...createAuthDto,
        password: hash
    })
    // const user = new this.authModel(createAuthDto);
    // return user.save();
    const tokens = await this.getTokens(newUser._id, newUser.email)
    await this.updateRefreshToken(newUser._id, tokens.refreshToken)
    return { ...tokens, ...user }
  }
  

  async signIn(data: SignInDto) {
    // Attempt to find the user by email or username
    const user = await this.authModel
      .findOne({
        $or: [{ email: data.email }, { username: data.username }],
      })
      .select('+password'); // Ensure to select the password field as it might be excluded by default
    
    // If no user is found, throw an exception
    if (!user) throw new NotFoundException('User does not exist');
    
    // Verify the provided password against the stored hash
    // const passwordMatches = await argon2.verify(user.password, data.password);
    // if (!passwordMatches) throw new BadRequestException('Incorrect email or password');
    
    // If password verification is successful, generate tokens
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    
    // Return the tokens and user information, excluding the password
    // console.log('Sign in method called', { ...data, ...user, tokens});
  // Construct and return the response object explicitly
    return {
      user: user,
      tokens: tokens,
    };
  }

  async hashData(data: string) {
    if (!data) {
      throw new Error('Data to hash is undefined or null.');
    }
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    try {
    if (!refreshToken) {
      throw new Error('Refresh token is undefined or null.');
    }
    const hashedRefreshToken = await this.hashData(refreshToken)

    await this.usersService.update1(userId, { refreshToken: hashedRefreshToken });

    return hashedRefreshToken;

  } catch (error) {
    // Handle potential errors, such as database connection issues
    throw new InternalServerErrorException('Unable to update refresh token');
  }
  }
  

  async findByEmail(email: string): Promise<AuthDocument> {
    return this.authModel.findOne({ email })
}


  findOneAndUpdate(id: string, updateAuthDto: UpdateAuthDto) {
    return this.authModel.findOneAndUpdate({ id }, updateAuthDto);
  }

  async remove(email: string) {
    return this.authModel.deleteOne({ email });
  }

  async getTokens(userId: string, email: string) {
    const [ accessToken, refreshToken ] = await Promise.all([
        this.jwtService.signAsync(
            {
                sub: userId,
                email
            },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m'
            }
        ),
        this.jwtService.signAsync(
            {
                sub: userId,
                email
            },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d'
            }
        )
    ])

    return {
        accessToken,
        refreshToken
    }

    

    
}
  public async getUserFromAuthenticationToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    
    const userId = payload.sub
    console.log('Sign in method called', { userId});
    if (userId) {
        return this.usersService.findById(userId);
    }
  }


}



