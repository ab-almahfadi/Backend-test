import { Message, MessageDocument } from './message.schema';
import { Socket } from 'socket.io';
import { AuthService } from './../auth/auth.service';
import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto } from './dto/message.dto';
import { User, UserDocument } from 'src/_schemas/user.schema';


@Injectable()
export class ChatsService {
    private readonly logger = new Logger(ChatsService.name);
    constructor(
        // @InjectModel(User.name) private userModel: Model<UserDocument>,
        private authService: AuthService, @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

    async getUserFromSocket(socket: Socket) {
        let auth_token = socket.handshake.headers.authorization;
        // get the token itself without "Bearer"
        auth_token = auth_token.split(' ')[1];

        const user = this.authService.getUserFromAuthenticationToken(
            auth_token
        );
        
        if (!user) {
            throw new WsException('Invalid credentials.');
        }

        return user;
    }


    async createMessage(message: MessageDto, auth_id: string): Promise<Message>  {
        this.logger.log('Message saved successfully', message);
        const newMessage = new this.messageModel({...message, auth_id})
        try {
            await newMessage.save();
            this.logger.log('Message saved successfully', newMessage);
        } catch (error) {
            this.logger.error('Failed to save message', error);
            throw error; // Rethrow or handle the error appropriately
        }
        return newMessage
    }

    async getAllMessages(auth_id?: string) {
        let query = {};
        
        if (auth_id) {
            query = { auth_id: auth_id };
        }
        console.log(query)
        
        return this.messageModel.find(query).populate('auth_id');
    }

    
}
