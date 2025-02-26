import { Injectable } from '@nestjs/common';
import { PrismaService } from '@se/prisma';
import { Response } from 'src/types/interfaces';
import { CreateMemberDTO, ParamIdDTO } from './member.restricted.dto';
import { Request } from 'express';
import { HTTPException } from '@se/customfilter';
import * as argon2 from 'argon2';

@Injectable()
export class MemberRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}
  // Get member
  async GetMemberService(): Promise<Response> {
    const member = await this.prismaService.users.findMany({
      where: {
        deletedAt: null,
      },
    });

    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Member สำเร็จ',
      data: member,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async CreateMemberService(
    data: CreateMemberDTO,
    req: Request,
  ): Promise<Response> {
    const { username, password, email, role } = data;

    const checkmember = await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
    });
    if (checkmember) {
      throw new HTTPException({
        message: `มีอีเมล ${email} นี้อยู่ในระบบแล้ว`,
      });
    }

    await this.prismaService.users.create({
      data: {
        email: email,
        username: username,
        password: await argon2.hash(password),
        role: {
          connect: { name: role },
        },
      },
    });
    await this.prismaService.logMember.create({
      data: {
        actionBy: {
          connect: {
            id: req.users.id,
          },
        },
        email: email,
        action: 'CREATE',
      },
    });

    return {
      statusCode: 200,
      message: 'สร้าง Member สำเร็จ',
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  // Update member
  async UpdateMemberService(
    data: CreateMemberDTO,
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { email, username, role } = data;
    const member = await this.prismaService.users.findUnique({
      where: {
        id: Number(param.id),
      },
    });

    if (!member) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Member นี้`,
      });
    }

    await this.prismaService.users.update({
      where: { id: member.id },
      data: {
        username: username,
        role: {
          connect: { name: role },
        },
      },
    });

    if (!username && role) {
      await this.prismaService.logMember.create({
        data: {
          actionBy: {
            connect: {
              id: req.users.id,
            },
          },
          email: email,
          action: 'EDIT',
          before: member.roleId.toString(),
          after: role,
        },
      });
    }
    if (username && !role) {
      await this.prismaService.logMember.create({
        data: {
          actionBy: {
            connect: {
              id: req.users.id,
            },
          },
          email: email,
          action: 'EDIT',
          before: member.username,
          after: username,
        },
      });
    }
    if (username && role) {
      await this.prismaService.logMember.create({
        data: {
          actionBy: {
            connect: {
              id: req.users.id,
            },
          },
          email: email,
          action: 'EDIT',
          before: `${member.username} ${member.roleId}`,
          after: `${username} ${role}`,
        },
      });
    }

    return {
      statusCode: 200,
      message: `อัปเดต Member: ${email} สำเร็จ`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  // Delete member
  async DeleteMemberService(
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const member = await this.prismaService.users.findUnique({
      where: {
        id: Number(param.id),
      },
    });

    if (!member) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Member นี้`,
      });
    }

    await this.prismaService.users.update({
      where: { id: member.id },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.prismaService.logMember.create({
      data: {
        actionBy: {
          connect: {
            id: req.users.id,
          },
        },
        email: member.email,
        action: 'DELETE',
      },
    });

    return {
      statusCode: 200,
      message: `ลบ Member: ${member.email} สำเร็จ`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
