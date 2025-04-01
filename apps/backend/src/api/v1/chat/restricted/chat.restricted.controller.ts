import { ChatRestrictedService } from './chat.restricted.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
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

  @Get('/')
  async GetMessageController() {
    const data = await this.chatrestrictedservice.GetChaatService();
    return {
      message: 'success',
      data: data,
    };
  }
}
