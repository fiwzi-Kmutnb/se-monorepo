import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { OrderRestrictedService } from './order.restricted.service';
import { Request } from 'express';
import {
  ParamIdDTO,
  UpdateStatusOrderDTO,
  ViewOrderDTO,
} from './order.restricted.dto';
import { RequirePermission } from 'src/decorators/permission.decorator';

@Controller('v1/restricted/order')
@UseGuards(AuthGuard)
export class OrderRestrictedController {
  constructor(private readonly OrderService: OrderRestrictedService) {}
  @Get('/vieworder')
  @RequirePermission('orderEdit')
  async GetOrderController(@Body() status: ViewOrderDTO) {
    return this.OrderService.GetOrderService(status);
  }

  @Get('/:id')
  @RequirePermission('orderEdit')
  async GetOrderIdController(@Param() param: ParamIdDTO) {
    return this.OrderService.GetOrderIdService(param);
  }

  @Patch('/status/:id')
  @RequirePermission('orderEdit')
  async UpdateStatusOrderController(
    @Body() body: UpdateStatusOrderDTO,
    @Param() param: ParamIdDTO,
    @Req() req: Request,
  ) {
    return this.OrderService.UpdateStatusOrderService(body, param, req);
  }
}
