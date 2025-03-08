import { Module } from '@nestjs/common';
import { ChatRestrictedService } from './restricted/chat.restricted.service';
import { ChatRestrictedGateway } from './restricted/chat.restricted.gateway';
import { ChatRestrictedController } from './restricted/chat.restricted.controller';

@Module({
  providers: [ChatRestrictedService, ChatRestrictedGateway],
  controllers: [ChatRestrictedController]
})
export class ChatModule {}
