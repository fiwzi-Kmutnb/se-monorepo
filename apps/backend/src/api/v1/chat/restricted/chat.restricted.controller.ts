import { ChatRestrictedService } from './chat.restricted.service';
import { Controller, Post, Body } from '@nestjs/common';
import { message } from '../chat.entity';

@Controller('restricted/chat')
export class ChatRestrictedController {
  constructor(private readonly chatrestrictedservice: ChatRestrictedService) {}

  @Post('/hook_message')
  async HookMessageController(@Body() body: message) {
    return this.chatrestrictedservice.HookMessageService(body);
  }
}
