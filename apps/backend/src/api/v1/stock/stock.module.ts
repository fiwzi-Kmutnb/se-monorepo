import { Module } from '@nestjs/common';
import { StockAuthroizedService } from './authroized/stock.authroized.service';
import { StockAuthroizedController } from './authroized/stock.authroized.controller';
import { StockRestrictedService } from './restricted/stock.restricted.service';
import { StockRestrictedController } from './restricted/stock.restricted.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [StockAuthroizedService, StockRestrictedService, PrismaService],
  controllers: [StockAuthroizedController, StockRestrictedController],
})
export class StockModule {}
