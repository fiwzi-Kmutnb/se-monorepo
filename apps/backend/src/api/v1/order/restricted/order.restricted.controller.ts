import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { OrderRestrictedService } from './order.restricted.service';
import { ParamIdDTO, UpdateStatusOrderDTO } from './order.restricted.dto';
import { RequirePermission } from 'src/decorators/permission.decorator';

@Controller('v1/restricted/order')
@UseGuards(AuthGuard)
export class OrderRestrictedController {
  constructor(private readonly OrderService: OrderRestrictedService) {}
  @Get('/accept')
  @RequirePermission('orderEdit')
  async GetAcceptOrderController() {
    return this.OrderService.GetAcceptOrderService();
  }

  @Get('/pending')
  @RequirePermission('orderEdit')
  async GetPendingOrderController() {
    return this.OrderService.GetPendingOrderService();
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
  ) {
    return this.OrderService.UpdateStatusOrderService(body, param);
  }
}
