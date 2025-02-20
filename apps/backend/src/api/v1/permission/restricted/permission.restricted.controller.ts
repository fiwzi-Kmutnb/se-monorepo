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
  CnURolesDTO,
  DeleteRolesDTO,
  ParamIdDTO,
} from './permission.restricted.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { PermissionGuard } from 'src/utils/permission.guard';
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
  @UseGuards(PermissionGuard)
  @RequirePermission('build_roles')
  async createRolesController(@Body() body: CnURolesDTO, @Req() req: Request) {
    return this.PermissionService.CreateRolesService(body, req);
  }

  @Patch('/:id')
  @UseGuards(PermissionGuard)
  @RequirePermission('edit_roles_member')
  async updateRolesController(
    @Body() body: CnURolesDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.PermissionService.UpdateRolesService(body, req, param);
  }

  @Delete('/:id')
  @UseGuards(PermissionGuard)
  @RequirePermission('edit_roles_member')
  async deleteRolesController(
    @Body() body: DeleteRolesDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.PermissionService.DeleteRolesService(body, req, param);
  }
}
