import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const createAndUpdateRolesDTO = z.object({
  name: z
    .string({
      message: 'กรุณากรอกชื่อบทบาท',
    })
    .min(1, {
      message: 'กรุณากรอกชื่อบทบาท',
    }),
  permissions: z
    .array(z.string(), {
      message: 'กรุณาเลือกสิทธิ์',
    })
    .min(1, {
      message: 'กรุณาเลือกสิทธิ์',
    }),
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

export class CreateAndUpdateRolesDTO extends createZodDto(
  createAndUpdateRolesDTO,
) {}
export class ParamIdDTO extends createZodDto(paramIdDTO) {}
