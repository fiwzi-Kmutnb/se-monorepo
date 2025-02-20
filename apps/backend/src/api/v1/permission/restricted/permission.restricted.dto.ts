import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const cuRolesDTO = z.object({
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

const deleteRolesDTO = z.object({
  name: z
    .string({
      message: 'กรุณาเลือกชื่อบทบาท',
    })
    .min(1, {
      message: 'กรุณาเลือกชื่อบทบาท',
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

export class CnURolesDTO extends createZodDto(cuRolesDTO) {}
export class DeleteRolesDTO extends createZodDto(deleteRolesDTO) {}
export class ParamIdDTO extends createZodDto(paramIdDTO) {}
