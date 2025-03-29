import { forwardRef, Module } from '@nestjs/common';
import { ChatRestrictedService } from './restricted/chat.restricted.service';
import { ChatRestrictedGateway } from './restricted/chat.restricted.gateway';
import { ChatRestrictedController } from './restricted/chat.restricted.controller';
import { PrismaService } from '@se/prisma';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({}), forwardRef(() => ChatModule)],
  providers: [ChatRestrictedService, ChatRestrictedGateway, PrismaService],
  controllers: [ChatRestrictedController],
  exports: [ChatRestrictedService],
})
export class ChatModule {}
