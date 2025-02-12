import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const productcreateDTO = z.object(
  {
    name: z.string({
      message: 'กรุณากรอกชื่อสินค้า',
    }),
    info: z.string().optional(),
    price: z
      .string({
        message: 'กรุณากรอกราคา',
      })
      .min(1, {
        message: 'กรุณากรอกราคา',
      })
      .refine((data) => !isNaN(Number(data)), {
        message: 'กรุณากรอกราคาให้ถูกต้อง',
      }),
    quantity: z
      .string({
        message: 'กรุณากรอกจำนวน',
      })
      .min(1, {
        message: 'กรุณากรอกจำนวน',
      })
      .refine((data) => !isNaN(Number(data)), {
        message: 'กรุณากรอกจำนวนให้ถูกต้อง',
      }),
    status: z
      .string({
        message: 'กรุณากรอกสถานะ',
      })
      .min(1, {
        message: 'กรุณากรอกสถานะ',
      })
      .refine((data) => ['true', 'false'].includes(data), {
        message: 'กรุณากรอกสถานะให้ถูกต้อง',
      }),
  },
  {
    message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  },
);

const productupdateDTO = z.object(
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

const productparamsDTO = z
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

export class ProductCreateDTO extends createZodDto(productcreateDTO) {}
export class ProductUpdateDTO extends createZodDto(productupdateDTO) {}
export class ProductParamsDTO extends createZodDto(productparamsDTO) {}
