import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { MemberRestrictedService } from './member.restricted.service';
import {
  CreateMemberDTO,
  UpdateMemberDTO,
  ParamIdDTO,
} from './member.restricted.dto';
import { Request } from 'express';

@Controller('v1/restricted/member')
@UseGuards(AuthGuard)
export class MemberRestrictedController {
  constructor(private readonly MemberService: MemberRestrictedService) {}
  @Get()
  async getMemberController() {
    return this.MemberService.GetMemberService();
  }

  @Post()
  async createMemberController(
    @Body() body: CreateMemberDTO,
    @Req() req: Request,
  ) {
    return this.MemberService.CreateMemberService(body, req);
  }

  @Patch('/:id')
  async updateMemberController(
    @Body() body: UpdateMemberDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.MemberService.UpdateMemberService(body, req, param);
  }

  @Delete('/:id')
  async deleteMemberController(
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.MemberService.DeleteMemberService(req, param);
  }
}
