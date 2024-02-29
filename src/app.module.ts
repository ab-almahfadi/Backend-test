import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { ChatsModule } from './chats/chats.module';
import mongodbConfig from '././shared/config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      load: [mongodbConfig],
    }),
    MongooseModule.forRoot(
      process.env.ENV === 'development'
        ? process.env.MONGO_URI
        : process.env.MONGO_PRODUCTION,
    ),
    JwtModule,
    MulterModule.register({
      dest: './upload',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    AuthModule,
    UsersModule,
    ChatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

}
