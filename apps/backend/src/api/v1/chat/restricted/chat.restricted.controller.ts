import { Server } from 'socket.io';
import { message } from './../../../../../dist/api/v1/chat/chat.entity.d';
import { ChatRestrictedService } from './chat.restricted.service';
import { Controller, Post, Body } from '@nestjs/common';
import { Extractmessage, Linemessage } from '../chat.entity';
import { WebSocketServer } from '@nestjs/websockets';

@Controller('restricted/chat')
export class ChatRestrictedController {
  constructor(private readonly chatrestrictedservice: ChatRestrictedService) {}
  @WebSocketServer() server: Server;

  @Post('/hook_message')
  async HookMessageController(@Body() body: Linemessage) {
    this.server.emit(
      'Receivemessage',
      this.chatrestrictedservice.HookMessageService(body),
    );
    // for (const event of body.events) {
    //   if (event.type === 'message' && event.message.type === 'text') {
    //     const extractmessage: Extractmessage = {
    //       message: event.message.text,
    //       type: event.message.type,
    //     };
    //     const user = {
    //       userId: event.source.userId,
    //       type: event.source.type,
    //     };
    //     this.server.emit('message', extractmessage);
    //   }
    // }
  }
}
