import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const updateStatusOrderDTO = z.object({
  totalprice: z
    .number({
      message: 'กรุณากรอกราคา',
    })
    .min(1, {
      message: 'กรุณากรอกราคา',
    })
    .optional(),
  status: z.enum(
    ['PENDING', 'ACCEPTED', 'CANCELLED', 'DELIVERING', 'SUCCESS'],
    {
      errorMap: () => ({ message: 'กรุณาเลือกสถานะ' }),
    },
  ),
});

const paramIdDTO = z
  .object({
    id: z.string({
      message: 'กรุณากรอกไอดี',
    }),
  })
  .refine((data) => !isNaN(Number(data.id)), {
    message: 'กรุณากรอก ID ให้ถูกต้อง',
  });

export class UpdateStatusOrderDTO extends createZodDto(updateStatusOrderDTO) {}
export class ParamIdDTO extends createZodDto(paramIdDTO) {}
