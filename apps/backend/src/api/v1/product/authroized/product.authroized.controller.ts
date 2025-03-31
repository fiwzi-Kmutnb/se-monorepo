import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { ProductAuthroizedService } from './product.authroized.service';
import {
  ProductCreateDTO,
  ProductParamsDTO,
  ProductUpdateDTO,
} from './product.authroized.dto';
import { Request, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { HTTPException } from '@se/customfilter';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/authroized/product')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProductAuthroizedController {
  constructor(
    private readonly productauthroizedService: ProductAuthroizedService,
  ) { }

  @Get('')
  async StockViewallController() {
    return this.productauthroizedService.ProductViewallService();
  }

  @Post('')
  @UseInterceptors(FileInterceptor('files'))
  async ProductCreateController(
    @Body() body: ProductCreateDTO,
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
    return this.productauthroizedService.ProductCreateService(body, req, files);
  }

  @Patch('/:id')
  async ProductUpdateController(
    @Body() body: ProductUpdateDTO,
    @Param() param: ProductParamsDTO,
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
    return this.productauthroizedService.ProductUpdateService(
      body,
      param,
      req,
      files,
    );
  }

  @Delete('/:id')
  async ProductDeleteController(
    @Param() param: ProductParamsDTO,
    @Req() req: Request,
  ) {
    return this.productauthroizedService.ProductDeleteService(param, req);
  }
}
