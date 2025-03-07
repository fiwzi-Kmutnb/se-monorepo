import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Extractmessage,
  Linemessage,
  Profile,
  Sendmessage,
} from '../chat.entity';
import { ResponseIO } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatRestrictedGateway } from './chat.restricted.gateway';
import { Socket } from 'socket.io';

@Injectable()
export class ChatRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ChatRestrictedGateway))
    private readonly chatgateway: ChatRestrictedGateway,
  ) {}

  async HookMessageService(data: Linemessage): Promise<ResponseIO> {
    try {
      for (const event of data.events) {
        if (event.type === 'message' && event.message?.type === 'text') {
          const extractmessage: Extractmessage = {
            message: event.message.text,
            type: event.message.type,
          };
          const user = {
            userId: event.source.userId,
            type: event.source.type,
          };

          try {
            const res = await firstValueFrom(
              this.httpService.get<Profile>(
                'https://api.line.me/v2/bot/profile/' + user.userId,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS}`,
                  },
                },
              ),
            );

            await this.prismaService.customer.upsert({
              where: {
                UserID: user.userId,
              },
              update: {},
              create: {
                UserID: user.userId,
                displayName: res.data.displayName,
                pictureUrl: res.data.pictureUrl,
              },
            });

            await this.prismaService.replyToken.create({
              data: {
                token: event.replyToken,
                customer: { connect: { UserID: user.userId } },
              },
            });

            const chatData = await this.prismaService.chat.findUnique({
              where: { cusID: user.userId },
              select: { data: true },
            });

            const prevMessages = chatData?.data || [];

            await this.prismaService.chat.upsert({
              where: {
                cusID: user.userId,
              },
              update: {
                data: [
                  ...(Array.isArray(prevMessages) ? prevMessages : []),
                  { text: extractmessage.message, timestamp: new Date() },
                ],
              },
              create: {
                customer: { connect: { UserID: user.userId } },
                data: [{ text: extractmessage.message, timestamp: new Date() }],
                monthAt: new Date(),
              },
            });
          } catch {
            throw new HTTPException({
              message: 'เกิดข้อผิดพลาด',
            });
          }

          this.chatgateway.sendMessageToClient(
            extractmessage.message,
            user.userId,
          );

          return {
            event: 'message',
            message: 'Receive Message ',
            data: extractmessage,
            type: 'SUCCESS',
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      console.log(error);
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }
  }

  async SendMessageService(
    data: Sendmessage,
    req: Socket,
  ): Promise<ResponseIO> {
    try {
      const user = await this.prismaService.users.findFirst({
        where: { id: req.users.id },
      });

      if (!user) {
        throw new HTTPException({
          message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
        });
      }

      // const replyToken = await this.prismaService.replyToken.findFirst({
      //   where: {
      //     customer: { UserID: data.userID },
      //   },
      // });

      // if (!replyToken) {
      //   throw new HTTPException({
      //     message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
      //   });
      // }

      await firstValueFrom(
        this.httpService.post(
          'https://api.line.me/v2/bot/message/push',
          {
            to: data.userID,
            messages: [{ type: 'text', text: data.message }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS}`,
            },
          },
        ),
      ).catch(() => {
        throw new HTTPException({
          message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
        });
      });

      // await this.prismaService.replyToken.delete({
      //   where: {
      //     id: replyToken.id,
      //   },
      // });

      await this.prismaService.logChat.create({
        data: {
          user: { connect: { id: req.users.id } },
          message: data.message,
          IP: req.handshake.address,
        },
      });

      return {
        event: 'message',
        message: 'Send Message ',
        type: 'SUCCESS',
        //   timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
      });
    }
  }
}
