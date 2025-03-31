import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  Get,
  UploadedFile,
  ParseFilePipeBuilder,
  UseInterceptors,
} from '@nestjs/common';
import { AuthAuthroizedService } from './auth.authroized.service';
import { ResetPasswordDTO } from './auth.authroized.dto';
import { AuthGuard } from 'src/utils/jwt.guard';
import { Request } from 'express';
import { HTTPException } from '@se/customfilter';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/authroized/auth')
@UseGuards(AuthGuard)
export class AuthAuthroizedController {
  constructor(private readonly Authauthroizedservice: AuthAuthroizedService) {}

  @Patch('resetpassword')
  async resetpasswordController(
    @Body() body: ResetPasswordDTO,
    @Req() req: Request,
  ) {
    return this.Authauthroizedservice.resetpasswordService(body, req);
  }

  @Get('@me')
  async meController(@Req() req: Request) {
    return {
      data: req.users,
    };
  }

  @Patch('editprofile')
  @UseInterceptors(FileInterceptor('files'))
  async updateController(
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
        }),
    )
    files: Express.Multer.File,
  ) {
    console.log(files);
    return this.Authauthroizedservice.editprofileService(files, req);
  }
}
