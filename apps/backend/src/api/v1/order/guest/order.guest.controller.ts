import { Controller, Get, Param, Patch } from '@nestjs/common';
import { OrderGuestService } from './order.guest.service';
import { ParamTokenDTO } from './order.guest.dto';

@Controller('v1/guest/order')
export class OrderGuestController {
  constructor(private readonly OrderService: OrderGuestService) {}
  @Get('/:token')
  async GetOrderController(@Param() param: ParamTokenDTO) {
    return this.OrderService.GetOrderService(param);
  }

  @Patch('/:token')
  async UpdateStatusOrderController(@Param() param: ParamTokenDTO) {
    return this.OrderService.UpdateStatusOrderService(param);
  }
}
