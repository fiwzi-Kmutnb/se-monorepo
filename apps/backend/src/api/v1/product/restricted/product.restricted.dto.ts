import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const logstockDTO = z.object(
  {
    username: z
      .string({
        message: 'กรุณากรอกชื่อ',
      })
      .min(1, {
        message: 'กรุณากรอกชื่อ',
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

export class LogStockDTO extends createZodDto(logstockDTO) {}
