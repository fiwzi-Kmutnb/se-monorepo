import {
  CnURolesDTO,
  DeleteRolesDTO,
  ParamIdDTO,
} from './permission.restricted.dto';
import { Injectable } from '@nestjs/common';
import { Response } from 'src/types/interfaces';
import { PrismaService } from '@se/prisma';
import { HTTPException } from '@se/customfilter';
import { Request } from 'express';
import * as datapermissions from 'src/utils/permissions.json';

@Injectable()
export class PermissionRestrictedService {
  constructor(private readonly prismaService: PrismaService) {}
  // Get roles
  async GetRolesService(): Promise<Response> {
    const roles = await this.prismaService.role.findMany({
      where: {
        deletedAt: null,
      },
    });

    return {
      statusCode: 200,
      message: 'ดึงข้อมูล Role สำเร็จ',
      data: roles,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async CreateRolesService(data: CnURolesDTO, req: Request): Promise<Response> {
    const { name, permissions } = data;
    const checkroles = await this.prismaService.role.findFirst({
      where: { name: name },
    });

    if (checkroles) {
      throw new HTTPException({
        message: `มีบทบาท ${name} นี้อยู่แล้ว`,
      });
    }

    const jsonData: Record<string, number> = datapermissions;
    const bitwire = permissions.reduce(
      (acc, key) => acc + (jsonData[key] ?? 0),
      0,
    );

    await this.prismaService.role.create({
      data: {
        name: name,
        permission: bitwire,
        createdby: {
          connect: {
            id: req.users.id,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: `บันทึกข้อมูลสำเร็จ Role: ${name}`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  // Update roles
  async UpdateRolesService(
    data: CnURolesDTO,
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { name, permissions } = data;
    const roles = await this.prismaService.role.findUnique({
      where: {
        id: Number(param.id),
        deletedAt: null,
      },
    });

    if (!roles) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Role: ${name} นี้`,
      });
    }

    const jsonData: Record<string, number> = datapermissions;
    const bitwire = permissions.reduce(
      (acc, key) => acc + (jsonData[key] ?? 0),
      0,
    );

    await this.prismaService.role.update({
      where: { id: roles.id },
      data: {
        permission: bitwire,
        updatedby: {
          connect: {
            id: req.users.id,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: `อัปเดต Role: ${name} สำเร็จ`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }

  async DeleteRolesService(
    data: DeleteRolesDTO,
    req: Request,
    param: ParamIdDTO,
  ): Promise<Response> {
    const { name } = data;
    const roles = await this.prismaService.role.findUnique({
      where: { id: Number(param.id) },
    });

    if (!roles) {
      throw new HTTPException({
        message: `ไม่พบข้อมูล Role: ${name} นี้`,
      });
    }
    await this.prismaService.role.update({
      where: { id: roles.id },
      data: {
        deletedAt: new Date().toISOString(),
        deletedby: {
          connect: {
            id: req.users.id,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: `ลบข้อมูล Role: ${name} สำเร็จ`,
      type: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };
  }
}
