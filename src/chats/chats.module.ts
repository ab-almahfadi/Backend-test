import { Message, MessageSchema } from './message.schema';
import { Module, forwardRef  } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema },
    
  ]),
  forwardRef(() => AuthModule),
],
  controllers: [ChatsController],
  providers: [ChatsService]
})
export class ChatsModule {}
