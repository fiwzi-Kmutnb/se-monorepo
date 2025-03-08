import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TransformInterceptor } from '@se/custominterceptor';
import { AllExceptionsFilter } from '@se/customfilter';
import { ZodValidationPipe } from '@se/custompipe';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './api/v1/auth/auth.module';
import { PrismaModule } from '@se/prisma';
import { MemberModule } from './api/v1/member/member.module';
import { PermissionModule } from './api/v1/permission/permission.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProductModule } from './api/v1/product/product.module';
import { BroadcastModule } from './api/v1/broadcast/broadcast.module';
import { join } from 'path';
import { ChatModule } from './api/v1/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        // ignoreTLS: true,
        secure: false,
        tls: { rejectUnauthorized: false },
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {},
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      serveRoot: '/storage',
    }),
    AuthModule,
    PrismaModule,
    MemberModule,
    PermissionModule,
    ProductModule,
    BroadcastModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
