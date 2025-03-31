import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Extractmessage,
  Linemessage,
  orderformat,
  orderlist,
  payment,
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
// import QrScanner from 'qr-scanner';
import * as Jimp from 'jimp';
import * as QrCode from 'qrcode-reader';
import { parse } from 'promptparse';

@Injectable()
export class ChatRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ChatRestrictedGateway))
    private readonly chatgateway: ChatRestrictedGateway,
  ) {}

  orders: orderlist = [];
  contact: { address: string; phone: string } = {
    address: '',
    phone: '',
  };
  createorder: orderformat = {
    id: null,
    cusID: '',
    menu: [],
    quantity: 0,
    totalprice: 0,
    address: '',
    phone: '',
    status: 'PENDING',
    createAt: null,
  };

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

  async HookMessageService(data: Linemessage) {
    try {
      for (const event of data.events) {
        if (
          !['text', 'image'].includes(event.message?.type) ||
          event.message?.text == '1' ||
          event.message?.text == 'Menu' ||
          event.message?.text == 'Payment'
        ) {
          return;
        }
        await firstValueFrom(
          this.httpService.get<Profile>(
            'https://api.line.me/v2/bot/profile/' + event.source.userId,
            {
              headers: {
                Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS}`,
              },
            },
          ),
        ).then(async (res) => {
          await this.prismaService.customer.upsert({
            where: {
              UserID: event.source.userId,
            },
            update: {
              displayName: res.data.displayName,
              pictureUrl: res.data.pictureUrl,
            },
            create: {
              UserID: event.source.userId,
              displayName: res.data.displayName,
              pictureUrl: res.data.pictureUrl,
            },
          });
        });
        const user = {
          userId: event.source.userId,
          type: event.source.type,
        };
        if (event.type === 'message' && event.message?.type === 'text') {
          const extractmessage: Extractmessage = {
            message: event.message.text,
            type: event.message.type,
          };
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
                {
                  text: extractmessage.message,
                  typeSender: 'self',
                  type: 'text',
                  timestamp: new Date(),
                },
              ],
            },
            create: {
              customer: { connect: { UserID: user.userId } },
              data: [
                {
                  text: extractmessage.message,
                  typeSender: 'self',
                  type: 'text',
                  timestamp: new Date(),
                },
              ],
              monthAt: new Date(),
            },
          });

          if (/^- ?แซนวิช/.test(extractmessage.message)) {
            this.OrderProcessingService(user.userId, extractmessage.message);
          } else if (/^ที่อยู่/.test(extractmessage.message)) {
            this.AddressProcessingService(user.userId, extractmessage.message);
          } else if (/^\s*(ยืนยัน|ยกเลิก)\s*$/.test(extractmessage.message)) {
            if (
              /ยกเลิก/.test(extractmessage.message) &&
              this.orders.length > 0
            ) {
              this.PushMessageToLineService(
                user.userId,
                'ยกเลิกการสั่งซื้อเรียบร้อยแล้ว',
              );
            } else {
              this.OrderHandleService(user.userId, this.orders);
            }
          }
          this.chatgateway.sendMessageToClient(
            extractmessage.message,
            user.userId,
            'text',
          );
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
              const filename = `${generate(30)}.${res.headers['content-type'].split('/')[1]}`;
              fs.writeFileSync(`./storage/slip/${filename}`, res.data);
              const image = await Jimp.Jimp.read(res.data);
              const qr = new QrCode();
              qr.callback = async (
                err: Error | null,
                result: { result: string } | null,
              ) => {
                if (err) {
                  console.log('Error decoding QR code:', err);
                }
                if (result) {
                  // console.log('QR Code result:', result.result);
                  const pqqr = parse(result.result);
                  if (pqqr !== null) {
                    await firstValueFrom(
                      this.httpService.post<payment>(
                        `https://suba.rdcw.co.th/v1/inquiry`,
                        {
                          payload: result.result,
                        },
                        {
                          auth: {
                            username: process.env.USER_SLIP,
                            password: process.env.PASSWORD_SLIP,
                          },
                        },
                      ),
                    ).then(async (res) => {
                      const amount = res?.data?.data?.amount;
                      if (amount == null) {
                        this.PushMessageToLineService(
                          user.userId,
                          'จำนวนเงินไม่ถูกต้อง',
                        );
                        return;
                      }
                      const lastOrder =
                        await this.prismaService.order.findFirst({
                          where: {
                            customer_Lineid: user.userId,
                            status: 'ACCEPTED',
                          },
                        });
                      if (lastOrder == null) {
                        this.PushMessageToLineService(
                          user.userId,
                          'ไม่พบรายการสั่งซื้อที่ต้องการชำระเงิน',
                        );
                        return;
                      }
                      if (lastOrder.totalprice != amount) {
                        this.PushMessageToLineService(
                          user.userId,
                          'จำนวนเงินไม่ถูกต้อง',
                        );
                        return;
                      }
                      const bank_receiver_account =
                        res?.data?.data?.receiver?.account?.value?.replaceAll(
                          '-',
                          '',
                        );
                      const bank_receiver_proxy =
                        res?.data?.data?.receiver?.proxy?.value?.replaceAll(
                          '-',
                          '',
                        );
                      if (bank_receiver_account != null) {
                        const bank_receiver_accountLength =
                          bank_receiver_account.length;
                        for (let x = 0; x < bank_receiver_accountLength; x++) {
                          if (bank_receiver_account[x].toUpperCase() != 'X') {
                            if (
                              bank_receiver_account[x] !=
                              process.env.BANK_NUMBER[x]
                            ) {
                              this.PushMessageToLineService(
                                user.userId,
                                'โอนเข้าบัญชีไม่ถูกต้อง',
                              );
                              return;
                            }
                          }
                        }
                      }
                      if (bank_receiver_proxy != null) {
                        const bank_receiver_proxyLength =
                          bank_receiver_proxy.length;
                        const ppLength = process.env.PROMPTPAY_PHONE.length;
                        const tranLength = process.env.TRANSACTION_QR.length;
                        for (let x = 0; x < bank_receiver_proxyLength; x++) {
                          if (bank_receiver_proxy[x].toUpperCase() != 'X') {
                            if (bank_receiver_proxyLength == ppLength) {
                              if (
                                bank_receiver_proxy[x] !=
                                process.env.PROMPTPAY_PHONE[x]
                              ) {
                                this.PushMessageToLineService(
                                  user.userId,
                                  'โอนเข้าบัญชีไม่ถูกต้อง',
                                );
                                return;
                              }
                            } else if (
                              bank_receiver_proxyLength == tranLength
                            ) {
                              if (
                                bank_receiver_proxy[x] !=
                                process.env.TRANSACTION_QR[x]
                              ) {
                                this.PushMessageToLineService(
                                  user.userId,
                                  'โอนเข้าบัญชีไม่ถูกต้อง',
                                );
                                return;
                              }
                            } else {
                              this.PushMessageToLineService(
                                user.userId,
                                'โอนเข้าบัญชีไม่ถูกต้อง',
                              );
                              return;
                            }
                          }
                        }
                      }
                      await this.prismaService.order
                        .update({
                          where: {
                            id: lastOrder.id,
                          },
                          data: {
                            payments: {
                              create: {
                                price: amount,
                                bank_type: res?.data?.data?.receivingBank,
                                type: 'QRCODE_CHECK',
                                transaction: res?.data?.data?.transRef,
                                respone: JSON.parse(
                                  JSON.stringify(res?.data?.data),
                                ),
                                status: 'SUCCESS',
                              },
                            },
                          },
                        })
                        .then(() => {
                          this.PushMessageToLineService(
                            user.userId,
                            'ยืนยันการชำระเงิน ชำระเงินสำเร็จ',
                          );
                        })
                        .catch(async () => {
                          await this.prismaService.order.update({
                            where: {
                              id: lastOrder.id,
                            },
                            data: {
                              payments: {
                                create: {
                                  price: amount || 0,
                                  bank_type:
                                    res?.data?.data?.receivingBank || null,
                                  type: 'QRCODE_CHECK',
                                  transaction:
                                    res?.data?.data?.transRef || null,
                                  respone:
                                    JSON.parse(
                                      JSON.stringify(res?.data?.data),
                                    ) || null,
                                  status: 'FAILED',
                                },
                              },
                            },
                          });
                          this.PushMessageToLineService(
                            user.userId,
                            'เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน',
                          );
                        });
                    });
                  }
                }
              };
              qr.decode(image.bitmap);

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
                    {
                      text: filename,
                      typeSender: 'self',
                      type: 'image',
                      timestamp: new Date(),
                    },
                  ],
                },
                create: {
                  customer: { connect: { UserID: user.userId } },
                  data: [
                    {
                      text: filename,
                      typeSender: 'self',
                      type: 'image',
                      timestamp: new Date(),
                    },
                  ],
                  monthAt: new Date(),
                },
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    } catch (error) {
      return;
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

  private async AddressProcessingService(
    customer: string,
    data: string,
  ): Promise<void> {
    const cleanedLines = data
      .trim()
      .split('\n')
      .map((line) => line.trim());

    const phoneRegex = /เบอร์\s?(.+)/;
    const addressRegex = /ที่อยู่\s?(.+)/;

    const phoneMatch = cleanedLines.find((line) => phoneRegex.test(line));
    const addressMatch = cleanedLines.find((line) => addressRegex.test(line));

    const phone = phoneMatch ? phoneMatch.match(phoneRegex)?.[1] : null;
    const address = addressMatch
      ? addressMatch.match(addressRegex)?.[1]?.trim()
      : null;

    // console.log('📌 ตรวจสอบข้อมูล:', { address, phone });

    if (this.orders.length === 0) {
      this.PushMessageToLineService(customer, 'ไม่พบรายการอาหารที่คุณสั่ง');
      return;
    }

    if (!address || !phone) {
      this.PushMessageToLineService(
        customer,
        'กรุณาระบุที่อยู่หรือเบอร์โทรศัพท์ของคุณให้ถูกต้อง',
      );
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      this.PushMessageToLineService(
        customer,
        'กรุณาระบุเบอร์โทรศัพท์ของคุณให้ถูกต้องๅๅ',
      );
      return;
    }

    this.contact.address = address;
    this.contact.phone = phone;

    this.PushMessageToLineService(
      customer,
      `อัปเดตข้อมูลที่อยู่และเบอร์โทรศัพท์เรียบร้อยแล้ว`,
      `รายการสั่งซื้อของคุณคือ\n${this.orders
        .map(
          (order) =>
            `${order.menu} ${order.quantity} ${
              order.detail ? `(${order.detail})` : ''
            }`,
        )
        .join('\n')}`,
      'กรุณายืนยันคำสั่งซื้อ \n-ยืนยัน\n-ยกเลิก',
    );
  }

  private async OrderProcessingService(
    customer: string,
    data: string,
  ): Promise<void> {
    this.orders = await Promise.all(
      data
        .split('\n')
        .map(async (line) => {
          const match = line.match(/-?(.+?)\s(\d+)(?:\s?\((.*?)\))?$/);
          if (match) {
            const menu = match[1].trim();
            const quantity = parseInt(match[2], 10);
            const detail = match[3]?.trim() || '';

            if (isNaN(quantity) || quantity <= 0) {
              await this.PushMessageToLineService(
                customer,
                `กรุณากรอกจำนวนสินค้าให้ถูกต้อง`,
              );
              return null;
            }

            // console.log('📌 ตรวจสอบข้อมูล:', {
            //   menu: menu.trim().replace(/\s+/g, ''),
            //   quantity,
            //   detail,
            // });

            const menuRegex = menu.trim().replace(/\s+/g, '');
            const menuItem = await this.prismaService.product.findFirst({
              where: { name: { contains: menuRegex } },
            });

            if (!menuItem) {
              await this.PushMessageToLineService(customer, `ไม่พบเมนูในระบบ`);
              return null;
            }

            return {
              menu,
              quantity,
              detail,
            };
          }
          return null;
        })
        .filter(Boolean),
    );

    if (this.orders.length > 0) {
      this.PushMessageToLineService(
        customer,
        `กรุณากรอกที่อยู่และเบอร์โทรศัพท์ของคุณ\nที่อยู่ <ที่อยู่>\nเบอร์ <เบอร์โทรศัพท์>\n\nตัวอย่าง\nที่อยู่ 123 ถนน ABC\nเบอร์ 0123456789`,
      );
    } else {
      this.PushMessageToLineService(
        customer,
        `กรุณากรอกข้อมูลรายการอาหารให้ถูกต้อง`,
      );
    }
  }

  private async OrderHandleService(
    customerID: string,
    order: orderlist,
  ): Promise<void> {
    if (order.length === 0) {
      this.PushMessageToLineService(customerID, 'ไม่พบรายการอาหารที่คุณสั่ง');
      return;
    } else {
      this.PushMessageToLineService(
        customerID,
        `รับรายการสั่งซื้อของคุณเรียบร้อยแล้ว`,
        `กรุณารอสักครู่....`,
      );
      // .then(() => {
      //   this.PushImageToLineService(
      //     customerID,
      //     'https://placehold.co/600x600',
      //     'https://placehold.co/600x600',
      //   );
      // });
    }

    const detail = await this.prismaService.order.create({
      data: {
        Customer: { connect: { UserID: customerID } },
        orderlist: order,
        status: 'PENDING',
        quantity: this.orders
          .map((order) => order.quantity)
          .reduce((a, b) => a + b, 0),
        address: this.contact.address || null,
        phone: this.contact.phone || null,
        createdAt: new Date(),
        totalprice:
          this.orders
            .map((order) => order.quantity)
            .reduce((a, b) => a + b, 0) * 50,
      },
    });

    this.createorder = {
      id: detail.id,
      menu: this.orders,
      cusID: customerID,
      address: this.contact.address,
      phone: this.contact.phone,
      quantity: detail.quantity,
      totalprice: detail.totalprice,
      status: detail.status,
      createAt: detail.createdAt,
    };

    this.chatgateway.sendOrderToClient(customerID, this.createorder);
  }
}
