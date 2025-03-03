import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AnnounceBroadcastDTO, ParamIdDTO } from './broadcast.restricted.dto';
import { Response } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { generate } from 'randomstring';
import * as fs from 'fs';

@Injectable()
export class BroadcastRestrictedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async SendBroadcastMessageService(
    data: AnnounceBroadcastDTO,
    files: Express.Multer.File,
    req: Request,
  ): Promise<Response> {
    const { broadcastMessage } = data;

    const filename = `${generate(30)}.${files.mimetype.split('/')[1]}`;
    fs.writeFileSync(`./storage/broadcast/${filename}`, files.buffer);

    const messagePayload = broadcastMessage
      ? [{ type: 'text', text: broadcastMessage }]
      : [];

    const broadcastImage = `www.localhost:5000/storage/broadcast/${filename}`;
    const imagePayload = broadcastImage
      ? [
          {
            type: 'image',
            originalContentUrl: broadcastImage,
            previewImageUrl: broadcastImage,
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
        if (broadcastMessage || broadcastImage) {
          return this.prismaService.logBroadcast.create({
            data: {
              broadcastImage: broadcastImage,
              broadcastMessage: broadcastMessage,
              amount_customer: follower.data.followers,
              actionBy: {
                connect: { id: req.users.id },
              },
              action: 'ANNOUNCE',
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
  async GetBroadcastMessageService(): Promise<Response> {
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

  async CreateBroadcastMessageService(
    data: AnnounceBroadcastDTO,
    files: Express.Multer.File,
    req: Request,
  ): Promise<Response> {
    const { broadcastMessage } = data;
    const filename = `${generate(30)}.${files.mimetype.split('/')[1]}`;
    fs.writeFileSync(`./storage/broadcast/${filename}`, files.buffer);

    await this.prismaService.broadcast.create({
      data: {
        broadcastMessage: broadcastMessage,
        broadcastImage: filename,
      },
    });
    await this.prismaService.logBroadcast.create({
      data: {
        broadcastImage: filename,
        broadcastMessage: broadcastMessage,
        actionBy: {
          connect: { id: req.users.id },
        },
        action: 'CREATE',
      },
    });

    return {
      statusCode: 200,
      message: 'บันทึกข้อมูลสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async DeleteBroadcastMessageService(
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
