import { Module } from '@nestjs/common';
import { BroadcastRestrictedService } from './restricted/broadcast.restricted.service';
import { BroadcastRestrictedController } from './restricted/broadcast.restricted.controller';
import { PrismaService } from '@se/prisma';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BroadcastRestrictedService, PrismaService],
  controllers: [BroadcastRestrictedController],
})
export class BroadcastModule {}
