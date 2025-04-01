import { PrismaService } from '@se/prisma';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import {
  ParamIdDTO,
  UpdateStatusOrderDTO,
  ViewOrderDTO,
} from './order.restricted.dto';
import { generate } from 'randomstring';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class OrderRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) { }

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

  private async NotifyStatustoLine(
    userID: string,
    status: string,
    msg: string,
    totalprice: number,
  ) {
    if (status === 'DELIVERING') {
      await this.PushMessageToLineService(
        userID,
        'ออเดอร์ของคุณอยู่ระหว่างการจัดส่ง',
      );
    } else if (status === 'ACCEPTED') {
      await this.PushMessageToLineService(
        userID,
        'ร้านได้ทำการรับออเดอร์ของคุณเรียบร้อยแล้ว',
        `กรุณาชำระเงิน ${totalprice} บาท`,
      );
    } else if (status == 'CANCELLED') {
      await this.PushMessageToLineService(
        userID,
        'ร้านได้ทำการยกเลิกออเดอร์ของคุณเรียบร้อยแล้ว',
        `${msg}`,
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

  async GetOrderService(data: ViewOrderDTO): Promise<Response> {
    const { status } = data;
    if (!status) {
      throw new HTTPException({
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      });
    }
    const order = await this.prismaService.order.findMany({
      where: {
        status: status ? status : undefined,
      },
      include: {
        Customer: true,
      },
    });

    if (order.length === 0) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }
    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Order สำเร็จ',
      data: order || null,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async UpdateStatusOrderService(
    data: UpdateStatusOrderDTO,
    param: ParamIdDTO,
    req: Request,
  ): Promise<Response> {
    const { totalprice, status, message } = data;

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

    const Updatedata: {
      status: 'DELIVERING' | 'ACCEPTED' | 'CANCELLED' | 'PENDING' | 'SUCCESS';
      totalprice: number;
      message: string | null;
      deliveryToken?: { create: { token: string; status: 'DELIVERING' } };
      user?: { connect: { id: number } };
    } = {
      status: status,
      totalprice:
        status === 'ACCEPTED'
          ? totalprice
            ? totalprice + 10
            : order.totalprice + 10
          : order.totalprice,
      message: status === 'CANCELLED' ? message : null,
    };

    if (status === 'DELIVERING') {
      const token = generate(32);
      Updatedata.deliveryToken = { create: { token, status: 'DELIVERING' } };
    }

    if (status === 'ACCEPTED') {
      Updatedata.user = { connect: { id: req.users.id } };
    }

    // console.log('Updatedata', Updatedata);

    if (status === 'CANCELLED' && order.status === 'DELIVERING') {
      return {
        statusCode: 400,
        message: 'ไม่สามารถยกเลิกออเดอร์ได้',
        type: 'SUCCESS',
        timestamp: new Date().toISOString(),
      };
    } else {
      await this.prismaService.order.update({
        where: {
          id: Number(param.id),
        },
        data: Updatedata,
      });

      this.NotifyStatustoLine(
        order.customer_Lineid,
        status,
        message ? message : null,
        Updatedata.totalprice,
      ).catch((e) => {
        console.log(e);
        throw new HTTPException({
          message: 'เกิดข้อผิดพลาดในการส่งข้อความ',
        });
      });

      return {
        statusCode: 200,
        message: 'ยืนยัน Order สำเร็จ',
        type: 'SUCCESS',
        data: {
          token: Updatedata.deliveryToken,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
