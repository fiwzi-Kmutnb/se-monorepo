import { Module } from '@nestjs/common';
import { DashboardAuthroizedService } from './authroized/dashboard.authroized.service';
import { DashboardAuthroizedController } from './authroized/dashboard.authroized.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [DashboardAuthroizedService, PrismaService],
  controllers: [DashboardAuthroizedController],
})
export class DashboardModule {}
