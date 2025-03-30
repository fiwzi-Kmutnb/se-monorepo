import { Module } from '@nestjs/common';
import { OrderRestrictedService } from './restricted/order.restricted.service';
import { OrderRestrictedController } from './restricted/order.restricted.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [OrderRestrictedService, PrismaService],
  controllers: [OrderRestrictedController],
})
export class OrderModule {}
