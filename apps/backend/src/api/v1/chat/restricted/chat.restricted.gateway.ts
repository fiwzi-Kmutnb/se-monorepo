import { Injectable } from '@nestjs/common';
import { Extractmessage, Linemessage, Sendmessage } from '../chat.entity';
import { ResponseIO } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import axios from 'axios';

@Injectable()
export class ChatRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}

  async HookMessageService(data: Linemessage): Promise<ResponseIO> {
    try {
      for (const event of data.events) {
        if (event.type === 'message' && event.message.type === 'text') {
          const extractmessage: Extractmessage = {
            message: event.message.text,
            type: event.message.type,
          };
          const user = {
            userId: event.source.userId,
            type: event.source.type,
          };

          const customerInfo = await axios
            .get('https://api.line.me/v2/bot/profile/' + user.userId, {
              headers: {
                Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              },
            })
            .catch(() => {
              throw new HTTPException({
                message: 'เกิดข้อผิดพลาด',
              });
            });

          await this.prismaService.customer
            .upsert({
              where: {
                UserID: user.userId,
              },
              update: {},
              create: {
                UserID: user.userId,
                displayName: customerInfo.data.displayName,
                pictureUrl: customerInfo.data.pictureUrl,
              },
            })
            .catch(() => {
              throw new HTTPException({
                message: 'เกิดข้อผิดพลาด',
              });
            });

          this.StoreReplyTokenService(event.source.userId, event.replyToken);

          return {
            event: 'message',
            message: 'Receive Message ',
            data: extractmessage,
            type: 'SUCCESS',
            //   timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }
  }

  private async StoreReplyTokenService(userid: string, tokenreply: string) {
    await this.prismaService.replyToken.create({
      data: {
        cusID: userid,
        token: tokenreply,
        status: 'ACTIVE',
      },
    });
  }

  async SendMessageService(data: Sendmessage): Promise<ResponseIO> {
    try {
      const replyToken = await this.prismaService.replyToken.findFirst({
        where: {
          OR: [
            {
              status: 'ACTIVE',
            },
          ],
          cusID: data.userID,
        },
      });

      if (!replyToken) {
        throw new HTTPException({
          message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
        });
      }

      await axios
        .post(
          'https://api.line.me/v2/bot/message/push',
          {
            to: data.userID,
            messages: [{ type: 'text', text: data.message }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
          },
        )
        .catch(() => {
          throw new HTTPException({
            message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
          });
        });

      await this.prismaService.replyToken.update({
        where: {
          id: replyToken.id,
        },
        data: {
          status: 'USED',
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