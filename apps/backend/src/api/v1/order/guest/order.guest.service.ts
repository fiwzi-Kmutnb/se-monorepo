import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { ParamTokenDTO } from './order.guest.dto';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';

@Injectable()
export class OrderGuestService {
  constructor(private readonly prismaService: PrismaService) {}
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
      throw new Error('เกิดข้อผิดพลาด');
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
  async UpdateSuccessOrderService(param: ParamTokenDTO): Promise<Response> {
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
    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
