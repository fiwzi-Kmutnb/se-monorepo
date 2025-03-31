import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const saledashboardDTO = z.object({
  startdate: z
    .string({
      message: 'กรุณากรอกวันที่เริ่มต้น',
    })
    .min(1, {
      message: 'กรุณากรอกวันที่เริ่มต้น',
    }),
  enddate: z
    .string({
      message: 'กรุณากรอกวันที่สิ้นสุด',
    })
    .min(1, {
      message: 'กรุณากรอกวันที่สิ้นสุด',
    }),
  groupby: z.enum(['day', 'month', 'year'], {
    errorMap: () => ({ message: 'กรุณาเลือกการจัดกลุ่ม' }),
  }),
});

export class SaleDashboardDTO extends createZodDto(saledashboardDTO) {}
