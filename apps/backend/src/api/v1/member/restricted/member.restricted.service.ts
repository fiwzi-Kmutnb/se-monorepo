import {
  CreateMemberDTO,
  ParamIdDTO,
  UpdateMemberDTO,
} from './member.restricted.dto';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import { Request } from 'express';
import * as argon2 from 'argon2';

@Injectable()
export class MemberRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}
  async GetMemberService(): Promise<Response> {
    const member = await this.prismaService.users.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile_img: true,
        role: {
          select: {
            name: true,
            id: true,
          },
        },
        logLogin: {
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        createdAt: true,
      },
    });
    console.log(member);

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

    const roleCheck = await this.prismaService.role.findUnique({
      where: {
        id: role,
        NOT: {
          permission: -1,
        },
      },
    });
    console.log(roleCheck);
    if (!roleCheck) {
      throw new HTTPException({
        message: `Role ${role} ไม่พบในระบบ`,
      });
    }

    await this.prismaService.users.create({
      data: {
        email: email,
        username: username,
        password: await argon2.hash(password),
        role: {
          connect: { id: role },
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
  async UpdateMemberService(
    data: UpdateMemberDTO,
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { role } = data;
    const member = await this.prismaService.users.findUnique({
      where: {
        id: Number(param.id),
        NOT: {
          role: {
            permission: -1,
          },
        },
      },
      include: {
        role: true,
      },
    });

    if (!member) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Member นี้ หรือไม่สามารถแก้ไขได้`,
      });
    }

    const roleCheck = await this.prismaService.role.findUnique({
      where: {
        id: role,
        NOT: {
          permission: -1,
        },
      },
    });

    if (!roleCheck) {
      throw new HTTPException({
        message: `Role ${role} ไม่พบในระบบ`,
      });
    }

    const user = await this.prismaService.users.update({
      where: { id: member.id },
      data: {
        role: {
          connect: { id: role },
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
        email: user.email,
        action: 'EDIT',
        before: member.role.name,
        after: roleCheck.name,
      },
    });

    return {
      statusCode: 200,
      message: `อัปเดต Member สำเร็จ`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
  async DeleteMemberService(
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const member = await this.prismaService.users.findUnique({
      where: {
        id: Number(param.id),
        role: {
          NOT: {
            permission: -1,
          },
        },
      },
    });

    if (!member) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Member นี้ หรือไม่สามารถลบได้`,
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
