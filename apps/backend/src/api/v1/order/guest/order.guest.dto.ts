import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const paramTokenDTO = z
  .object({
    token: z.string({
      required_error: 'กรุณากรอก Token',
    }),
  })
  .refine((data) => /^[a-zA-Z0-9]+$/.test(data.token), {
    message: 'กรุณากรอก Token ให้ถูกต้อง',
  });

export class ParamTokenDTO extends createZodDto(paramTokenDTO) {}
