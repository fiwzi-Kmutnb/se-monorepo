import { PermissionGuard } from 'src/utils/permission.guard';
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';

export const RequirePermission = (permission: string) => {
  return applyDecorators(
    SetMetadata('permission', permission),
    UseGuards(PermissionGuard),
  );
};
