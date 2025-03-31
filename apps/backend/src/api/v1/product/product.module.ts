import { Module } from '@nestjs/common';
import { ProductAuthroizedService } from './authroized/product.authroized.service';
import { ProductAuthroizedController } from './authroized/product.authroized.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [ProductAuthroizedService, PrismaService],
  controllers: [ProductAuthroizedController],
})
export class ProductModule {}
