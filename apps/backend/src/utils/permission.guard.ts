import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as permissionsData from 'src/utils/permissions.json';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<number>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.users;

    if (!user) {
      throw new ForbiddenException('ไม่พบข้อมูลผู้ใช้');
    }

    // ของผู้ใช้งาน
    const userBitwisePermission = user.role.permission;

    // ของ json
    const requiredPermissionValue = permissionsData[requiredPermission];

    if ((userBitwisePermission & requiredPermissionValue) === 0) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    }

    return true;
  }
}
