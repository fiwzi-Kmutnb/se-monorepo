import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HTTPException } from '@se/customfilter';
import { Request } from 'express';
import * as permissionsData from 'src/utils/permissions.json';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
        message: '',
      });
    }

    const requiredPermissionValue = permissionsData[requiredPermissionKey];

    const userBitwisePermission = user.permission;

    if (
      (parseInt(String(userBitwisePermission), 2) &
        parseInt(String(requiredPermissionValue), 2)) ===
      0
    ) {
      throw new HTTPException({
        message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      });
    }

    return true;
  }
}
