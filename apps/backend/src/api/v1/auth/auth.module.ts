import { Module } from '@nestjs/common';
import { AuthGuestService } from './guest/auth.guest.service';
import { AuthGuestController } from './guest/auth.guest.controller';
import { AuthAuthroizedService } from './authroized/auth.authroized.service';
import { AuthAuthroizedController } from './authroized/auth.authroized.controller';
import { PrismaService } from '@se/prisma';

@Module({
  providers: [AuthGuestService, AuthAuthroizedService, PrismaService],
  controllers: [AuthGuestController, AuthAuthroizedController],
})
export class AuthModule {}
