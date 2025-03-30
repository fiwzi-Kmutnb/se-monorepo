import { PrismaService } from '@se/prisma';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import { ParamIdDTO, UpdateStatusOrderDTO } from './order.restricted.dto';
import { generate } from 'randomstring';

@Injectable()
export class OrderRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}

  async GetOrderByIdService(param: ParamIdDTO): Promise<Response> {
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
    if (status === 'DELIVERING') {
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
      const token = generate(32);
      await this.prismaService.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: status,
          deliveryToken: {
            create: {
              token: token,
              status: 'DELIVERING',
            },
          },
        },
      });
    } else {
      await this.prismaService.order.update({
        where: {
          id: Number(param.id),
        },
        data: {
          status: status,
          totalprice: status === 'ACCEPTED' ? totalprice + 10 : totalprice,
        },
      });
    }
    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  // async UpdateSuccessOrderService(
  //   data: UpdateStatusOrderDTO,
  //   param: ParamIdDTO,
  // ): Promise<Response> {
  //   const { status } = data;
  //   const order = await this.prismaService.order.findUnique({
  //     where: {
  //       id: Number(param.id),
  //     },
  //     include: {
  //       deliveryToken: true,
  //     },
  //   });
  //   if (!order) {
  //     throw new HTTPException({
  //       message: 'เกิดข้อผิดพลาด',
  //     });
  //   }
  //   await this.prismaService.order.update({
  //     where: {
  //       id: order.id,
  //     },
  //     data: {
  //       status: status,
  //       deliveryToken: {
  //         update: {
  //           where: {
  //             id: order.deliveryToken[0].id,
  //           },
  //           data: {
  //             status: 'DELIVERED',
  //           },
  //         },
  //       },
  //     },
  //   });
  //   return {
  //     statusCode: 200,
  //     message: 'ยืนยัน Order สำเร็จ',
  //     type: 'SUCCESS',
  //     timestamp: new Date().toISOString(),
  //   };
  // }
}
