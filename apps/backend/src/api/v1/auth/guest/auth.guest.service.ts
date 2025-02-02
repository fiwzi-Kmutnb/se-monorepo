import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { JwtService } from '@nestjs/jwt';
import {
  ForgotConfirmPasswordDTO,
  ForgotDTO,
  ForgotVerifyDTO,
  LoginDTO,
} from './auth.guest.dto';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import * as argon2 from 'argon2';
import * as nodemailer from 'nodemailer';
import { generate } from 'randomstring';

const transporter = nodemailer.createTransport({
  host: '147.50.229.75',
  port: 587,
  secure: false,
  auth: {
    user: 'software@strity.net',
    pass: 'vjg518?2U',
  },
  tls: { rejectUnauthorized: false },
});
@Injectable()
export class AuthGuestService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async loginService(req: LoginDTO): Promise<Response> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: req.email,
      },
    });

    if (!user) {
      throw new HTTPException({
        message: 'รหัสผ่านผิดพลาดหรือผู้ใช้งานผิดพลาด',
      });
    }

    if (!(await argon2.verify(user.password, req.password))) {
      throw new HTTPException({
        message: 'รหัสผ่านผิดพลาดหรือผู้ใช้งานผิดพลาด',
      });
    }

    const payload = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    });

    return {
      statusCode: 200,
      message: 'User found',
      data: {
        token: payload,
      },
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async ForgotPassword(req: ForgotDTO): Promise<Response> {
    const email = await this.prismaService.users.findUnique({
      where: {
        email: req.email,
      },
    });
    if (!email) {
      throw new HTTPException({
        message: 'หากไม่พบอีเมลใน กรุณาตรวจสอบในกล่องขยะ',
      });
    }

    const token = generate(32);

    await this.prismaService.emailTokens.create({
      data: {
        user: { connect: { id: email.id } },
        token: token,
      },
    });

    const sendmail = await transporter.sendMail({
      from: '"Tumgapkaomaipen"<software@strity.net>',
      to: email.email,
      subject: 'Reset Password',
      text: `http://localhost:3000/resetpassword?token=${token}`,
    });

    if (!sendmail) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    return {
      statusCode: 200,
      message: 'หากไม่พบอีเมลใน กรุณาตรวจสอบในกล่องขยะ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async ForgotPasswordVerify(data: ForgotVerifyDTO): Promise<Response> {
    const token = await this.prismaService.emailTokens.findFirst({
      where: {
        OR: [
          {
            status: 'PENDING',
          },
          {
            status: 'VERIFIED',
          },
        ],
        token: data.token,
      },
    });

    if (!token) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    if (new Date().getTime() - token.createdAt.getTime() > 1000 * 60 * 15) {
      await this.prismaService.emailTokens.update({
        where: {
          id: token.id,
        },
        data: {
          status: 'EXPIRED',
        },
      });

      throw new HTTPException({
        message: 'โทเคนหมดอายุ กรุณาลองใหม่อีกครั้ง',
      });
    }

    if (token.status === 'PENDING') {
      await this.prismaService.emailTokens.update({
        where: {
          id: token.id,
        },
        data: {
          status: 'VERIFIED',
        },
      });

      return {
        statusCode: 200,
        message: 'โทเคนถูกต้อง',
        type: 'SUCCESS',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      statusCode: 200,
      message: 'โทเคนถูกต้อง',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async ForgotConfirmPassword(
    data: ForgotConfirmPasswordDTO,
    param: ForgotVerifyDTO,
  ): Promise<Response> {
    const tokenverify = await this.prismaService.emailTokens.findFirst({
      where: {
        token: param.token,
        status: 'VERIFIED',
      },
    });

    if (!tokenverify) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาด',
      });
    }

    await this.prismaService.emailTokens.update({
      where: {
        id: tokenverify.id,
      },
      data: {
        status: 'SUCCESS',
      },
    });

    await this.prismaService.users.update({
      where: {
        id: tokenverify.userId,
      },
      data: {
        password: await argon2.hash(data.password),
      },
    });

    return {
      statusCode: 200,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
