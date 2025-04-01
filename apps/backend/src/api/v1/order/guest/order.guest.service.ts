import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { ParamTokenDTO } from './order.guest.dto';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderGuestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

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

  async GetOrderService(param: ParamTokenDTO): Promise<Response> {
    const order = await this.prismaService.order.findFirst({
      where: {
        deliveryToken: {
          some: {
            token: param.token,
          },
        },
      },
      include: {
        deliveryToken: true,
      },
    });
    if (!order) {
      throw new HTTPException({
        message: 'ไม่พบ Order นี้',
      });
      // throw new Error('เกิดข้อผิดพลาด');
    }
    if (
      new Date().getTime() - order.deliveryToken[0].createdAt.getTime() >
      1000 * 60 * 60 * 3
    ) {
      await this.prismaService.order.update({
        where: {
          id: order.deliveryToken[0].id,
        },
        data: {
          status: 'ERROR',
        },
      });

      throw new HTTPException({
        message: 'โทเคนหมดอายุ กรุณาลองใหม่อีกครั้ง',
      });
    }
    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  async UpdateStatusOrderService(param: ParamTokenDTO): Promise<Response> {
    const order = await this.prismaService.order.findFirst({
      where: {
        deliveryToken: {
          some: {
            token: param.token,
          },
        },
      },
      include: {
        deliveryToken: true,
      },
    });

    if (!order) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: 'SUCCESS',
        deliveryToken: {
          update: {
            where: {
              id: order.deliveryToken[0].id,
            },
            data: {
              status: 'DELIVERED',
            },
          },
        },
      },
    });
    await this.PushMessageToLineService(
      order.customer_Lineid,
      `ส่งออเดอร์สำเร็จ`,
      `ขอบคุณที่ใช้บริการ`,
      `หากมีข้อสงสัยสามารถติดต่อได้ที่ Line: @seproject`,
    );
    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
