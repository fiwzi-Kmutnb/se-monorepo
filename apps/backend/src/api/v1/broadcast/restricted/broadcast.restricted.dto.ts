import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const announceBroadcastDTO = z.object({
  broadcast_message: z.string({ message: 'กรุณากรอกข้อความ' }).optional(),
  broadcast_img: z.string({ message: 'กรุณากรอก URL' }).url().optional(),
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

export class AnnounceBroadcastDTO extends createZodDto(announceBroadcastDTO) {}
export class ParamIdDTO extends createZodDto(paramIdDTO) {}
