import { Module } from '@nestjs/common';
import { MemberRestrictedService } from './restricted/member.restricted.service';
import { MemberRestrictedController } from './restricted/member.restricted.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [MemberRestrictedService, PrismaService],
  controllers: [MemberRestrictedController],
})
export class MemberModule {}
