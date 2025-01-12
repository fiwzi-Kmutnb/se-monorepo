import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const loginDTO = z.object(
  {
    email: z
      .string({
        message: 'กรุณากรอกอีเมล',
      })
      .min(1, {
        message: 'กรุณากรอกอีเมล',
      })
      .email({
        message: 'กรอกอีเมลให้ถูกต้อง',
      }),
    password: z
      .string({
        message: 'กรุณากรอกรหัสผ่าน',
      })
      .min(1, {
        message: 'กรุณากรอกรหัสผ่าน',
      }),
  },
  {
    message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
  },
);

export class LoginDTO extends createZodDto(loginDTO) {}
