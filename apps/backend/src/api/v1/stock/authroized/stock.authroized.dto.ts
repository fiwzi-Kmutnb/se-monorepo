import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const stockcreateDTO = z.object(
  {
    name: z.string({
      message: 'กรุณากรอกชื่อสินค้า',
    }),
    info: z.string().optional(),
    price: z.number({
      message: 'กรุณากรอกราคา',
    }),
    quantity: z.number({
      message: 'กรุณากรอกจำนวน',
    }),
    status: z.boolean({
      message: 'กรุณากรอกสถานะ',
    }),
  },
  {
    message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  },
);

const stockupdateDTO = z.object(
  {
    name: z.string({
      message: 'กรุณากรอกชื่อสินค้า',
    }),
    info: z.string().optional(),
    price: z.number({
      message: 'กรุณากรอกราคา',
    }),
    quantity: z.number({
      message: 'กรุณากรอกจำนวน',
    }),
    status: z.boolean({
      message: 'กรุณากรอกสถานะ',
    }),
  },
  {
    message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  },
);

const stockparamsDTO = z
  .object(
    {
      id: z.string({
        message: 'กรุณากรอก ID',
      }),
    },
    {
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
    },
  )
  .refine((data) => !isNaN(Number(data.id)), {
    message: 'กรุณากรอก ID ให้ถูกต้อง',
  });

export class StockCreateDTO extends createZodDto(stockcreateDTO) {}
export class StockUpdateDTO extends createZodDto(stockupdateDTO) {}
export class StockParamsDTO extends createZodDto(stockparamsDTO) {}
