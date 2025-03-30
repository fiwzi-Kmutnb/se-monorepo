import { PrismaService } from '@se/prisma';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import { ParamIdDTO, UpdateStatusOrderDTO } from './order.restricted.dto';
import { generate } from 'randomstring';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderRestrictedService {
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

  private async NotifyStatustoLine(userID: string, status: string) {
    if (status === 'DELIVERING') {
      await this.PushMessageToLineService(
        userID,
        'ออเดอร์ของคุณอยู่ระหว่างการจัดส่ง',
      );
    } else if (status === 'ACCEPTED') {
      await this.PushMessageToLineService(
        userID,
        'ร้านได้ทำการรับออเดอร์ของคุณเรียบร้อยแล้ว',
      );
    }
  }

  async GetOrderIdService(param: ParamIdDTO): Promise<Response> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: Number(param.id),
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
    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async GetAcceptOrderService(): Promise<Response> {
    const order = await this.prismaService.order.findMany({
      where: {
        status: 'ACCEPTED',
      },
    });
    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  async GetPendingOrderService(): Promise<Response> {
    const order = await this.prismaService.order.findMany({
      where: {
        status: 'PENDING',
      },
    });
    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async UpdateStatusOrderService(
    data: UpdateStatusOrderDTO,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { totalprice, status } = data;
    const order = await this.prismaService.order.findUnique({
      where: {
        id: Number(param.id),
      },
      include: status === 'DELIVERING' ? { deliveryToken: true } : undefined,
    });
    if (!order) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    const Updatedate: any = {
      status: status,
      totalprice: status === 'ACCEPTED' ? totalprice + 10 : totalprice,
    };

    if (status === 'DELIVERING') {
      const token = generate(32);
      Updatedate.deliveryToken = { create: { token, status: 'DELIVERING' } };
    }
    console.log('Updatedate', Updatedate);

    await this.prismaService.order.update({
      where: {
        id: Number(param.id),
      },
      data: Updatedate,
    });

    this.NotifyStatustoLine(order.customer_Lineid, status).catch(() => {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
      });
    });

    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
