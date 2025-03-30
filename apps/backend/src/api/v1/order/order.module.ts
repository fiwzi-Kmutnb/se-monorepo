import { Module } from '@nestjs/common';
import { OrderRestrictedService } from './restricted/order.restricted.service';
import { OrderRestrictedController } from './restricted/order.restricted.controller';
import { PrismaService } from '@se/prisma';
import { OrderGuestService } from './guest/order.guest.service';
import { OrderGuestController } from './guest/order.guest.controller';

@Module({
  providers: [OrderRestrictedService, PrismaService, OrderGuestService],
  controllers: [OrderRestrictedController, OrderGuestController],
})
export class OrderModule {}
