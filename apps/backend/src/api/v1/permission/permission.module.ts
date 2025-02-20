import { Module } from '@nestjs/common';
import { PermissionRestrictedService } from './restricted/permission.restricted.service';
import { PermissionRestrictedController } from './restricted/permission.restricted.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [PermissionRestrictedService, PrismaService],
  controllers: [PermissionRestrictedController],
})
export class PermissionModule {}
