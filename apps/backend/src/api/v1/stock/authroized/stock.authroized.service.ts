import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import {
  StockCreateDTO,
  StockParamsDTO,
  StockUpdateDTO,
} from './stock.authroized.dto';
import { Request } from 'express';

@Injectable()
export class StockAuthroizedService {
  constructor(private readonly prismaService: PrismaService) {}

  async StockViewallService(): Promise<Response> {
    const product = await this.prismaService.product.findMany({
      where: {
        deletedAt: null,
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    return {
      statusCode: 200,
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      data: {
        data: product,
      },
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async StockCreateService(
    data: StockCreateDTO,
    req: Request,
  ): Promise<Response> {
    const product = await this.prismaService.product.create({
      data: {
        name: data.name,
        info: data.info,
        price: data.price,
        quantity: data.quantity,
        status: data.status,
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.log_stock.create({
      data: {
        user: { connect: { id: req.users.id } },
        product: { connect: { id: product.id } },
        action: 'CREATE',
        quantity: product.quantity,
        IP: req.ip,
      },
    });

    return {
      statusCode: 200,
      message: 'เพิ่มสินค้าสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async StockUpdateService(
    data: StockUpdateDTO,
    param: StockParamsDTO,
    req: Request,
  ): Promise<Response> {
    const product = await this.prismaService.product.update({
      where: {
        id: Number(param.id),
      },
      data: {
        name: data.name,
        // img_product: data.img_product,
        info: data.info,
        price: data.price,
        quantity: data.quantity,
        status: data.status,
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.log_stock.create({
      data: {
        user: { connect: { id: req.users.id } },
        product: { connect: { id: product.id } },
        action: 'INCREASE',
        quantity: product.quantity,
        IP: req.ip,
      },
    });

    return {
      statusCode: 200,
      message: 'แก้ไขสินค้าสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async StockDeleteService(
    param: StockParamsDTO,
    req: Request,
  ): Promise<Response> {
    const product = await this.prismaService.product.update({
      where: {
        id: Number(param.id),
      },
      data: {
        status: false,
        deletedAt: new Date().toISOString(),
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.log_stock.create({
      data: {
        user: { connect: { id: req.users.id } },
        product: { connect: { id: product.id } },
        action: 'DELETE',
        quantity: product.quantity,
        IP: req.ip,
      },
    });

    return {
      statusCode: 200,
      message: 'ลบสินค้าสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
