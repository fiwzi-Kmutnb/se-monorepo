import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { StockAuthroizedService } from './stock.authroized.service';
import { AuthGuard } from 'src/utils/jwt.guard';
import { UseGuards } from '@nestjs/common';
import {
  StockCreateDTO,
  StockParamsDTO,
  StockUpdateDTO,
} from './stock.authroized.dto';
import { Request } from 'express';

@Controller('v1/authroized/stock')
@UseGuards(AuthGuard)
export class StockAuthroizedController {
  constructor(
    private readonly stockauthroizedService: StockAuthroizedService,
  ) {}

  @Get('')
  async StockViewallController() {
    return this.stockauthroizedService.StockViewallService();
  }

  @Post('')
  async StockCreateController(
    @Body() body: StockCreateDTO,
    @Req() req: Request,
  ) {
    return this.stockauthroizedService.StockCreateService(body, req);
  }

  @Patch('/:id')
  async StockUpdateController(
    @Body() body: StockUpdateDTO,
    @Param() param: StockParamsDTO,
    @Req() req: Request,
  ) {
    return this.stockauthroizedService.StockUpdateService(body, param, req);
  }

  @Delete('/:id')
  async StockDeleteController(
    @Param() param: StockParamsDTO,
    @Req() req: Request,
  ) {
    return this.stockauthroizedService.StockDeleteService(param, req);
  }
}
