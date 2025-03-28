import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Extractmessage,
  Linemessage,
  orderlist,
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
import { generate } from 'randomstring';
import * as fs from 'fs';

@Injectable()
export class ChatRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ChatRestrictedGateway))
    private readonly chatgateway: ChatRestrictedGateway,
  ) {}

  orders: orderlist = [];

  private async PushMessageToLineService(userID: string, ...texts: string[]) {
    const messages = texts
      .filter((text) => text && text.trim() !== '')
      .map((text) => ({ type: 'text', text }));
    await firstValueFrom(
      this.httpService.post(
        'https://api.line.me/v2/bot/message/push',
        {
          to: userID,
          messages: messages,
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
  }

  private async PushImageToLineService(
    userID: string,
    originalContentUrl: string,
    previewImageUrl: string,
  ) {
    await firstValueFrom(
      this.httpService.post(
        'https://api.line.me/v2/bot/message/push',
        {
          to: userID,
          messages: [
            {
              type: 'image',
              originalContentUrl,
              previewImageUrl,
            },
          ],
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
        message: 'เกิดข้อผิดพลาดในการส่งรูปภาพ',
      });
    });
  }

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

          if (/^- ?แซนวิช /.test(extractmessage.message)) {
            this.OrderProcessingService(user.userId, extractmessage.message);
          } else if (/^\s*(ยืนยัน|แก้ไข|ยกเลิก)/.test(extractmessage.message)) {
            this.OrderHandleService(user.userId, this.orders);
          } else {
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

              // await this.prismaService.replyToken.create({
              //   data: {
              //     token: event.replyToken,
              //     customer: { connect: { UserID: user.userId } },
              //   },
              // });

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
                  data: [
                    { text: extractmessage.message, timestamp: new Date() },
                  ],
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
        } else if (
          event.type === 'message' &&
          event.message?.type === 'image'
        ) {
          // this.PushImageToLineService(
          //   event.source.userId,
          //   `https://api.line.me/v2/bot/message/${event.message.id}/content`,
          //   `https://api.line.me/v2/bot/message/${event.message.id}/content`,
          // );
          await firstValueFrom(
            this.httpService.get(
              `https://api-data.line.me/v2/bot/message/${event.message.id}/content`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS}`,
                },
                responseType: 'arraybuffer',
              },
            ),
          )
            .then(async (res) => {
              // this.PushImageToLineService(
              //   event.source.userId,
              //   `data:${res.headers['content-type']};base64,${Buffer.from(
              //     res.data,
              //   ).toString('base64')}`,
              //   `data:${res.headers['content-type']};base64,${Buffer.from(
              //     res.data,
              //   ).toString('base64')}`,
              // );
              const filename = `${generate(30)}.${res.headers['content-type'].split('/')[1]}`;
              // console.log(filename);
              fs.writeFileSync(`./storage/slip/${filename}`, res.data);
              // const files = `data:${res.headers['content-type']};base64,${Buffer.from(
              await this.httpService.post(
                'https://api.line.me/v2/bot/message/push',
                {
                  to: event.source.userId,
                  messages: [
                    {
                      type: 'image',
                      originalContentUrl: `data:${res.headers['content-type']};base64,${Buffer.from(
                        res.data,
                      ).toString('base64')}`,
                      previewImageUrl: `data:${res.headers['content-type']};base64,${Buffer.from(
                        res.data,
                      ).toString('base64')}`,
                    },
                  ],
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS}`,
                  },
                },
              );
            })
            .catch((e) => {
              console.log(e);
            });
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
    client: Socket,
  ): Promise<ResponseIO> {
    console.log(data);
    try {
      const user = await this.prismaService.users.findFirst({
        where: { id: client.users.id },
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

      this.PushMessageToLineService(data.userID, data.message);

      // await this.prismaService.replyToken.delete({
      //   where: {
      //     id: replyToken.id,
      //   },
      // });

      await this.prismaService.logChat.create({
        data: {
          user: { connect: { id: client.users.id } },
          message: data.message,
          IP: client.handshake.address,
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

  private async OrderProcessingService(
    customer: string,
    data: string,
  ): Promise<void> {
    this.orders = data
      .split('\n')
      .map((line) => {
        const match = line.match(/-?(.+?)\s(\d+)(?:\s?\((.*?)\))?$/);
        if (match) {
          return {
            menu: match[1].trim(),
            quantity: parseInt(match[2], 10),
            detail: match[3]?.trim() || '',
          };
        }
      })
      .filter(Boolean);

    this.PushMessageToLineService(
      customer,
      `รายการสั่งซื้อของคุณคือ\n${this.orders
        .map(
          (order) =>
            `${order.menu} ${order.quantity} ${
              order.detail ? `(${order.detail})` : ''
            }`,
        )
        .join('\n')}`,
      'กรุณายืนยันคำสั่งซื้อ \n-ยืนยัน\n-ยกเลิก\n-แก้ไข',
    );
  }

  private async OrderHandleService(
    customerID: string,
    order: orderlist,
  ): Promise<void> {
    if (order.length === 0) {
      this.PushMessageToLineService(customerID, 'ไม่พบรายการอาหารที่คุณสั่ง');
    } else {
      this.chatgateway.sendOrderToClient(customerID, this.orders);
      this.PushMessageToLineService(
        customerID,
        `รับรายการสั่งซื้อของคุณเรียบร้อยแล้ว`,
        // `กรุณชำระเงิน`,
      );
      // .then(() => {
      //   this.PushImageToLineService(
      //     customerID,
      //     'https://placehold.co/600x600',
      //     'https://placehold.co/600x600',
      //   );
      // });
    }

    await this.prismaService.order.create({
      data: {
        Customer: { connect: { UserID: customerID } },
        orderlist: order,
        status: 'PENDING',
        quantity: this.orders
          .map((order) => order.quantity)
          .reduce((a, b) => a + b, 0),
        createdAt: new Date(),
        totalprice:
          this.orders
            .map((order) => order.quantity)
            .reduce((a, b) => a + b, 0) * 50,
      },
    });
  }
}
