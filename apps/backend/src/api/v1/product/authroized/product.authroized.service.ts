import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import {
  ProductCreateDTO,
  ProductParamsDTO,
  ProductUpdateDTO,
} from './product.authroized.dto';
import { Request } from 'express';
import * as fs from 'fs';
import { generate } from 'randomstring';

@Injectable()
export class ProductAuthroizedService {
  constructor(private readonly prismaService: PrismaService) { }

  async ProductViewallService(): Promise<Response> {
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

  async ProductCreateService(
    data: ProductCreateDTO,
    req: Request,
    files: Express.Multer.File,
  ): Promise<Response> {
    const filename = `${generate(30)}.${files.mimetype.split('/')[1]}`;
    fs.writeFileSync(`./storage/product/${filename}`, files.buffer);
    const { name, info, price, status, quantity } = data;
    const product = await this.prismaService.product.create({
      data: {
        name: name,
        img_product: filename,
        info: info,
        price: Number(price),
        quantity: Number(quantity),
        status: status === 'true',
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.logStock.create({
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

  async ProductUpdateService(
    data: ProductUpdateDTO,
    param: ProductParamsDTO,
    req: Request,
    files?: Express.Multer.File,
  ): Promise<Response> {
    const check = await this.prismaService.product.findUnique({
      where: {
        id: Number(param.id),
        deletedAt: null,
      },
      select: {
        img_product: true,
      },
    });

    if (!check) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    let filename = check.img_product;
    if (files) {
      filename = `${generate(30)}.${files.mimetype.split('/')[1]}`;
      fs.writeFileSync(`./storage/product/${filename}`, files.buffer);
    }
    const { name, info, price, status, quantity } = data;

    const product = await this.prismaService.product.update({
      where: {
        id: Number(param.id),
      },
      data: {
        name: name,
        img_product: filename,
        info: info,
        price: Number(price),
        quantity: Number(quantity),
        status: status,
      },
    });

    if (!product) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.logStock.create({
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

  async ProductDeleteService(
    param: ProductParamsDTO,
    req: Request,
  ): Promise<Response> {
    const check = await this.prismaService.product.findUnique({
      where: {
        id: Number(param.id),
        deletedAt: null,
      },
    });
    if (!check) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }
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

    await this.prismaService.logStock.create({
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
