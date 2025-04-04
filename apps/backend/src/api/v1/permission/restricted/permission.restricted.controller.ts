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
  @RequirePermission('rolesCreate')
  async createRolesController(
    @Body() body: CreateAndUpdateRolesDTO,
    @Req() req: Request,
  ) {
    return this.PermissionService.CreateRolesService(body, req);
  }

  @Patch('/:id')
  @RequirePermission('rolesEdit')
  async updateRolesController(
    @Body() body: CreateAndUpdateRolesDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.PermissionService.UpdateRolesService(body, req, param);
  }

  @Delete('/:id')
  @RequirePermission('rolesEdit')
  async deleteRolesController(@Req() req: Request, @Param() param: ParamIdDTO) {
    return this.PermissionService.DeleteRolesService(req, param);
  }
}
