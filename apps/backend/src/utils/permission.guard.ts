import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HTTPException } from '@se/customfilter';
import { PrismaService } from '@se/prisma';
import { Request } from 'express';
import * as permissionsData from 'src/utils/permissions.json';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissionKey = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermissionKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.users;

    if (!user) {
      throw new HTTPException({
        message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
      });
    }

    const requiredPermissionValue = permissionsData[requiredPermissionKey];

    const userperm = await this.prismaService.users.findUnique({
      where: {
        id: user.id,
      },
      include: {
        role: true,
      },
    });

    const userBitwisePermission = userperm.role.permission;
    if (userBitwisePermission === -1) {
      return true;
    }

    if (!!(userBitwisePermission & requiredPermissionValue)) {
      throw new HTTPException({
        message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      });
    }

    return true;
  }
}
