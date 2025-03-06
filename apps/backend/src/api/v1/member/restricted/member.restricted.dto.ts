import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const createMemberDTO = z.object({
  username: z
    .string({
      message: 'กรุณากรอกชื่อผู้ใช้',
    })
    .min(1, {
      message: 'กรุณากรอกชื่อผู้ใช้',
    }),
  password: z
    .string({
      message: 'กรุณากรอกรหัสผ่าน',
    })
    .min(8, {
      message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
    }),
  email: z
    .string({
      message: 'กรุณากรอกอีเมล',
    })
    .email({
      message: 'กรุณากรอกอีเมลให้ถูกต้อง',
    }),
  role: z.string({
    message: 'กรุณาเลือกบทบาท',
  }),
});

const updateMemberDTO = z.object({
  username: z
    .string({
      message: 'กรุณากรอกชื่อผู้ใช้',
    })
    .min(1, {
      message: 'กรุณากรอกชื่อผู้ใช้',
    }),
  email: z
    .string({
      message: 'กรุณากรอกอีเมล',
    })
    .email({
      message: 'กรุณากรอกอีเมลให้ถูกต้อง',
    }),
  role: z.string({
    message: 'กรุณาเลือกบทบาท',
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

export class CreateMemberDTO extends createZodDto(createMemberDTO) {}
export class UpdateMemberDTO extends createZodDto(updateMemberDTO) {}
export class ParamIdDTO extends createZodDto(paramIdDTO) {}
