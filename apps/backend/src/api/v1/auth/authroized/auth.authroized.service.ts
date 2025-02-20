import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDTO } from './auth.authroized.dto';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import { Express, Request } from 'express';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import { generate } from 'randomstring';

@Injectable()
export class AuthAuthroizedService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async resetpasswordService(
    data: ResetPasswordDTO,
    req: Request,
  ): Promise<Response> {
    const cpassword = await this.prismaService.users.findUnique({
      where: {
        id: req.users.id,
      },
    });

    if (!cpassword) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    const checkPassword = await argon2.verify(
      cpassword.password,
      data.oldpassword,
    );

    if (!checkPassword) {
      throw new HTTPException({
        message: 'รหัสผ่านเก่าไม่ถูกต้อง',
      });
    }
    const hash = await argon2.hash(data.newpassword);
    const update = await this.prismaService.users.update({
      where: {
        id: req.users.id,
      },
      data: {
        password: hash,
      },
    });
    if (!update) {
      throw new HTTPException({
        message: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
      });
    }
    return {
      statusCode: 200,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async editprofileService(
    data: Express.Multer.File,
    req: Request,
  ): Promise<Response> {
    const filename = `${generate(30)}.${data.mimetype.split('/')[1]}`;
    fs.writeFileSync(`./storage/profile/${filename}`, data.buffer);
    const update = await this.prismaService.users.update({
      where: {
        id: req.users.id,
      },
      data: {
        profile_img: filename,
      },
    });

    if (!update) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }
    return {
      statusCode: 200,
      message: 'แก้ไขโปรไฟล์สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
