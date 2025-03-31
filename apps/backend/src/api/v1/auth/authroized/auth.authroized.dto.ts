import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const resetpasswordDTO = z
  .object(
    {
      oldpassword: z
        .string({
          message: 'กรุณากรอกรหัสผ่านเก่า',
        })
        .min(1, {
          message: 'กรุณากรอกรหัสผ่านเก่า',
        }),

      newpassword: z
        .string({
          message: 'กรุณากรอกรหัสผ่านใหม่',
        })
        .min(1, {
          message: 'กรุณากรอกรหัสผ่านใหม่',
        }),

      confirmpassword: z
        .string({
          message: 'กรุณากรอกยืนยันรหัสผ่าน',
        })
        .min(1, {
          message: 'กรุณากรอกยืนยันรหัสผ่าน',
        }),
    },
    {
      message: 'กรุณากรอกรหัสผ่าน',
    },
  )
  .refine((data) => data.confirmpassword === data.newpassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmpassword'],
  });

export class ResetPasswordDTO extends createZodDto(resetpasswordDTO) {}
