import { ChatRestrictedService } from './chat.restricted.service';
import { Controller, Post, Body } from '@nestjs/common';
import { Linemessage } from '../chat.entity';

@Controller('v1/restricted/chat')
export class ChatRestrictedController {
  constructor(private readonly chatrestrictedservice: ChatRestrictedService) {}

  @Post('/hook_message')
  async HookMessageController(@Body() body: Linemessage) {
    // console.log(body.events);
    this.chatrestrictedservice.HookMessageService(body);
    return {
      message: 'success',
    };
  }
}
