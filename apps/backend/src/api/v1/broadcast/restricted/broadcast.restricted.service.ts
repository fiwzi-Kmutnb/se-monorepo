import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AnnounceBroadcastDTO, ParamIdDTO } from './broadcast.restricted.dto';
import { Response } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BroadcastRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async SendBroadcastMessage(
    data: AnnounceBroadcastDTO,
    req: Request,
  ): Promise<Response> {
    const { broadcast_message, broadcast_img } = data;

    const messagePayload = broadcast_message
      ? [{ type: 'text', text: broadcast_message }]
      : [];

    const imagePayload = broadcast_img
      ? [
          {
            type: 'image',
            originalContentUrl: broadcast_img,
            previewImageUrl: broadcast_img,
          },
        ]
      : [];

    const messages = [...messagePayload, ...imagePayload];

    if (messages.length === 0) {
      throw new HTTPException({ message: 'ไม่มีข้อความหรือภาพที่จะส่ง' });
    }

    return firstValueFrom(
      this.httpService.post(
        'https://api.line.me/v2/bot/message/broadcast',
        { messages },
        {
          headers: {
            Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    )
      .then(() => {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        return firstValueFrom(
          this.httpService.get(
            `https://api.line.me/v2/bot/insight/followers?date=${today}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
              },
            },
          ),
        );
      })
      .then((follower) => {
        if (broadcast_message || broadcast_img) {
          return this.prismaService.logBroadcast.create({
            data: {
              broadcast_img: broadcast_img || '',
              broadcast_message: broadcast_message || '',
              amount_customer: follower.data.followers,
              user: {
                connect: { id: req.users.id },
              },
            },
          });
        }
      })
      .then(() => ({
        statusCode: 200,
        message: 'ส่งข้อความ Broadcast สำเร็จ',
        type: 'SUCCESS' as const,
        timestamp: new Date().toISOString(),
      }))
      .catch(() => {
        throw new HTTPException({ message: 'ส่งข้อความ Broadcast ไม่สำเร็จ' });
      });
  }
  async GetBroadcastMessage(): Promise<Response> {
    const broadcastMessage = await this.prismaService.broadcast.findMany({
      where: { deletedAt: null },
    });

    return {
      statusCode: 200,
      message: 'ดึงข้อมูลสำเร็จ',
      type: 'SUCCESS',
      data: broadcastMessage,
      timestamp: new Date().toISOString(),
    };
  }

  async CreateBroadcastMessage(data: AnnounceBroadcastDTO): Promise<Response> {
    const { broadcast_message, broadcast_img } = data;

    if (!broadcast_message && !broadcast_img) {
      throw new HTTPException({ message: 'กรุณากรอกข้อความหรือ URL' });
    }

    await this.prismaService.broadcast.create({
      data: {
        broadcast_message: broadcast_message || '',
        broadcast_img: broadcast_img || '',
      },
    });

    return {
      statusCode: 200,
      message: 'บันทึกข้อมูลสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async UpdateBroadcastMessage(
    data: AnnounceBroadcastDTO,
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { broadcast_message, broadcast_img } = data;

    const broadcast = await this.prismaService.broadcast.findUnique({
      where: { id: Number(param.id) },
    });

    if (!broadcast) {
      throw new HTTPException({ message: 'ไม่พบข้อมูล Broadcast' });
    }

    await this.prismaService.broadcast.update({
      where: { id: Number(param.id) },
      data: {
        broadcast_message: broadcast_message || broadcast.broadcast_message,
        broadcast_img: broadcast_img || broadcast.broadcast_img,
      },
    });

    return {
      statusCode: 200,
      message: 'อัปเดตข้อมูลสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async DeleteBroadcastMessage(
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const broadcast = await this.prismaService.broadcast.findUnique({
      where: { id: Number(param.id) },
    });

    if (!broadcast) {
      throw new HTTPException({ message: 'ไม่พบข้อมูล Broadcast' });
    }

    await this.prismaService.broadcast.update({
      where: { id: Number(param.id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: 'ลบข้อมูลสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
