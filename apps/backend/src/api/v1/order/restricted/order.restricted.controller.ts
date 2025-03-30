import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { OrderRestrictedService } from './order.restricted.service';
import { ParamIdDTO, UpdateStatusOrderDTO } from './order.restricted.dto';

@Controller('v1/restricted/order')
@UseGuards(AuthGuard)
export class OrderRestrictedController {
  constructor(private readonly OrderService: OrderRestrictedService) {}
  @Get('/accept')
  async getAcceptOrderController() {
    return this.OrderService.GetAcceptOrderService();
  }

  @Get('/pending')
  async getPendingOrderController() {
    return this.OrderService.GetPendingOrderService();
  }

  @Patch('/accept/:id')
  async updateAcceptOrderController(
    @Body() body: UpdateStatusOrderDTO,
    @Param() param: ParamIdDTO,
  ) {
    return this.OrderService.UpdateAcceptOrderService(body, param);
  }

  @Patch('/pending/:id')
  async updatePendingOrderController(
    @Body() body: UpdateStatusOrderDTO,
    @Param() param: ParamIdDTO,
  ) {
    return this.OrderService.UpdatePendingOrderService(body, param);
  }
}
