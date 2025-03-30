import { Module } from '@nestjs/common';
import { OrderRestrictedService } from './restricted/order.restricted.service';
import { OrderRestrictedController } from './restricted/order.restricted.controller';
import { PrismaService } from '@se/prisma';
import { OrderGuestService } from './guest/order.guest.service';
import { OrderGuestController } from './guest/order.guest.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  providers: [OrderRestrictedService, PrismaService, OrderGuestService],
  controllers: [OrderRestrictedController, OrderGuestController],
})
export class OrderModule {}
