import {
  Body,
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { BroadcastRestrictedService } from './broadcast.restricted.service';
import { AnnounceBroadcastDTO, ParamIdDTO } from './broadcast.restricted.DTO';
import { Request } from 'express';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { HTTPException } from '@se/customfilter';

@Controller('v1/restricted/broadcast')
@UseGuards(AuthGuard)
export class BroadcastRestrictedController {
  constructor(private readonly BroadcastService: BroadcastRestrictedService) {}
  @Post('/announce')
  @RequirePermission('broadCast')
  @UseInterceptors(FileInterceptor('files'))
  async announceBroadcastController(
    @Body() body: AnnounceBroadcastDTO,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({
          errorHttpStatusCode: 400,
          exceptionFactory(error) {
            throw new HTTPException({
              message: error,
            });
          },
          fileIsRequired: false,
        }),
    )
    files?: Express.Multer.File,
  ) {
    return this.BroadcastService.SendBroadcastMessageService(body, req, files);
  }
  @Get()
  @RequirePermission('broadCast')
  async getBroadcastMessageController() {
    return this.BroadcastService.GetBroadcastMessageService();
  }
  @Post()
  @RequirePermission('broadCast')
  @UseInterceptors(FileInterceptor('files'))
  async createBroadcastController(
    @Req() req: Request,
    @Body() body: AnnounceBroadcastDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({
          errorHttpStatusCode: 400,
          exceptionFactory(error) {
            throw new HTTPException({
              message: error,
            });
          },
        }),
    )
    files: Express.Multer.File,
  ) {
    return this.BroadcastService.CreateBroadcastMessageService(
      body,
      files,
      req,
    );
  }

  @Delete('/:id')
  @RequirePermission('broadCast')
  async deleteBroadcastController(
    @Req() req: Request,
    @Param() param: ParamIdDTO,
  ) {
    return this.BroadcastService.DeleteBroadcastMessageService(req, param);
  }
}
