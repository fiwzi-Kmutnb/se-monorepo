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

const forgotDTO = z.object(
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
  },
  {
    message: 'กรุณากรอกอีเมล',
  },
);

const forgotVerifyDTO = z.object(
  {
    token: z
      .string({
        message: 'กรุณากรอกโทเคน',
      })
      .min(32, {
        message: 'กรุณากรอกโทเคน',
      })
      .max(32, {
        message: 'กรุณากรอกโทเคน',
      }),
  },
  {
    message: 'กรุณากรอกโทเคน',
  },
);

const forgotConfirmPasswordDTO = z
  .object(
    {
      password: z
        .string({
          message: 'กรุณากรอกรหัสผ่าน  ขั้นต่ำ 8 ตัวอักษร',
        })
        .min(8, {
          message: 'กรุณากรอกรหัสผ่าน ขั้นต่ำ 8 ตัวอักษร',
        }),
      confirmpassword: z
        .string({
          message: 'กรุณากรอกยืนยันรหัสผ่าน  ขั้นต่ำ 8 ตัวอักษร',
        })
        .min(8, {
          message: 'กรุณากรอกยืนยันรหัสผ่าน  ขั้นต่ำ 8 ตัวอักษร',
        }),
    },
    {
      message: 'กรุณากรอกรหัสผ่าน ขั้นต่ำ 8 ตัวอักษร',
    },
  )
  .refine((data) => data.confirmpassword === data.password, {
    message: 'รหัสผ่านไม่ตรงกัน',
  });

export class LoginDTO extends createZodDto(loginDTO) {}
export class ForgotDTO extends createZodDto(forgotDTO) {}
export class ForgotVerifyDTO extends createZodDto(forgotVerifyDTO) {}
export class ForgotConfirmPasswordDTO extends createZodDto(
  forgotConfirmPasswordDTO,
) {}
