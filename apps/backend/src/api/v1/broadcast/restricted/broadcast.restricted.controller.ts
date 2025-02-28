import {
  Body,
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { BroadcastRestrictedService } from './broadcast.restricted.service';
import { AnnounceBroadcastDTO, ParamIdDTO } from './broadcast.restricted.DTO';
import { Request } from 'express';

@Controller('v1/restricted/broadcast')
@UseGuards(AuthGuard)
export class BroadcastRestrictedController {
  constructor(private readonly BroadcastService: BroadcastRestrictedService) {}
  @Post('/announce')
  async announceBroadcastController(
    @Body() body: AnnounceBroadcastDTO,
    @Req() req: Request,
  ) {
    return this.BroadcastService.SendBroadcastMessage(body, req);
  }
  @Get()
  async getBroadcastMessageController() {
    return this.BroadcastService.GetBroadcastMessage();
  }
  @Post()
  async createBroadcastController(@Body() body: AnnounceBroadcastDTO) {
    return this.BroadcastService.CreateBroadcastMessage(body);
  }
  @Patch('/:id')
  async updateBroadcastController(
    @Body() body: AnnounceBroadcastDTO,
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.BroadcastService.UpdateBroadcastMessage(body, req, param);
  }
  @Delete('/:id')
  async deleteBroadcastController(
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.BroadcastService.DeleteBroadcastMessage(req, param);
  }
}
