import { Module } from '@nestjs/common';
import { ProductAuthroizedService } from './authroized/product.authroized.service';
import { ProductAuthroizedController } from './authroized/product.authroized.controller';
import { ProductRestrictedService } from './restricted/product.restricted.service';
import { ProductRestrictedController } from './restricted/product.restricted.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [
    ProductAuthroizedService,
    ProductRestrictedService,
    PrismaService,
  ],
  controllers: [ProductAuthroizedController, ProductRestrictedController],
})
export class ProductModule {}
