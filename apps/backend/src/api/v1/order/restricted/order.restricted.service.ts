import { PrismaService } from '@se/prisma';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import { ParamIdDTO, UpdateStatusOrderDTO } from './order.restricted.dto';

@Injectable()
export class OrderRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}

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
    if (order.length === 0) {
      throw new HTTPException({
        message: 'ไม่มี Order ที่รอการยืนยัน',
      });
    }
    return {
      statusCode: 200,
      message: 'ยืนยัน Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  async UpdateAcceptOrderService(
    data: UpdateStatusOrderDTO,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { totalprice, status } = data;
    const order = await this.prismaService.order.findUnique({
      where: {
        id: Number(param.id),
      },
    });
    if (!order) {
      throw new HTTPException({
        message: 'ไม่พบ Order นี้ในระบบ',
      });
    }
    await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalprice: totalprice ?? order.totalprice,
        status: status ?? order.status,
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
  async UpdatePendingOrderService(
    data: UpdateStatusOrderDTO,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { totalprice, status } = data;
    const order = await this.prismaService.order.findUnique({
      where: {
        id: Number(param.id),
      },
    });
    if (!order) {
      throw new HTTPException({
        message: 'ไม่พบ Order นี้ในระบบ',
      });
    }
    await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalprice: (totalprice ?? order.totalprice) + 10,
        status: status,
      },
    });
    return {
      statusCode: 200,
      message: 'อัพเดท Order สำเร็จ',
      data: order,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
