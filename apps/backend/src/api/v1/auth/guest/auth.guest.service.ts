import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './auth.guest.dto';
import { Response } from 'src/types/interfaces';
import { HTTPException } from '@se/customfilter';
import * as argon2 from 'argon2';

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

  // async ForgotPassword(email: string): Promise<Response> {
  //   const user = await this.prismaService.users.findUnique({
  //     where: {
  //       email: email,
  //     },
  //   });
  //   if (!user) {
  //     return {
  //       statusCode: 404,
  //       message: 'User not found',
  //       data: null,
  //       type: 'ERROR',
  //       timestamp: new Date().toISOString(),
  //     };
  //   }
  //   return {
  //     statusCode: 200,
  //     message: 'User found',
  //     data: user,
  //     type: 'SUCCESS',
  //     timestamp: new Date().toISOString(),
  //   };
  // }
}
