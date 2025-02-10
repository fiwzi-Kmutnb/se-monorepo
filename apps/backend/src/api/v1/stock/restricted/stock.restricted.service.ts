import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';

@Injectable()
export class StockRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}

  async ViewStock(): Promise<Response> {
    const dataDB = await this.prismaService.log_stock.findMany();

    if (!dataDB) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    return {
      statusCode: 200,
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      data: {
        data: dataDB,
      },
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
