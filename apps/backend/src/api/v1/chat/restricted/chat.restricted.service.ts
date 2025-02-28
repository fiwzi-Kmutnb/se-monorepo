import { Injectable } from '@nestjs/common';
import { message } from '../chat.entity';
import { ResponseIO } from 'src/types/interfaces';

@Injectable()
export class ChatRestrictedService {
  constructor() {}

  async HookMessageService(body: message): Promise<ResponseIO> {
    return {
      event: 'message',
      message: 'Message created',
      data: body,
      type: 'SUCCESS',
      //   timestamp: new Date().toISOString(),
    };
  }
}
