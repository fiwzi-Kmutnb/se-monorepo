import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { PermissionRestrictedService } from './permission.restricted.service';
import {
  CreateAndUpdateRolesDTO,
  DeleteRolesDTO,
  ParamIdDTO,
} from './permission.restricted.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { RequirePermission } from 'src/decorators/permission.decorator';

@Controller('v1/restricted/permission')
@UseGuards(AuthGuard)
export class PermissionRestrictedController {
  constructor(
    private readonly PermissionService: PermissionRestrictedService,
  ) {}
  @Get()
  async getRolesController() {
    return this.PermissionService.GetRolesService();
  }
  @Post()
  @RequirePermission('build_roles')
  async createRolesController(@Body() body: CreateAndUpdateRolesDTO) {
    return this.PermissionService.CreateRolesService(body);
  }

  @Patch('/:id')
  @RequirePermission('edit_roles_member')
  async updateRolesController(
    @Body() body: CreateAndUpdateRolesDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.PermissionService.UpdateRolesService(body, req, param);
  }

  @Delete('/:id')
  @RequirePermission('edit_roles_member')
  async deleteRolesController(
    @Body() body: DeleteRolesDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.PermissionService.DeleteRolesService(body, req, param);
  }
}
