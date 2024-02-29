import  RequestWithUser  from 'src/auth/requestWithUser.interface';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MessageDto } from './dto/message.dto';
import { ChatsService } from './chats.service';
import { Body, Controller, Post, Req, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';
// import { AuthGuard } from '@nestjs/passport';

@Controller()
export class ChatsController {
    constructor(private chatsService: ChatsService) {}

    // @UseGuards(AccessTokenGuard)
    @Post('sendMessage') 
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async createMessage(@Body() message: MessageDto, @Req() req) {
        const auth_id = req.user.sub;
        console.log(message.auth_id)
        // Convert ObjectId to string when using it
        // const userIdAsString: string = userId.toString();
        return this.chatsService.createMessage(message, auth_id)
    }


    @UseGuards(AccessTokenGuard)
    @Get('viewMessages') 
    async getAllMessages(@Req() req) {
        const auth_id = req.user.sub
        return this.chatsService.getAllMessages(auth_id)
    }
}
