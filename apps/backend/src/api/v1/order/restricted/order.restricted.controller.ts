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
  async getAcceptOrderController() {
    return this.OrderService.GetAcceptOrderService();
  }

  @Get('/pending')
  @RequirePermission('orderEdit')
  async getPendingOrderController() {
    return this.OrderService.GetPendingOrderService();
  }

  @Get('/:id')
  @RequirePermission('orderEdit')
  async getOrderByIdController(@Param() param: ParamIdDTO) {
    return this.OrderService.GetOrderByIdService(param);
  }

  @Patch('/status/:id')
  @RequirePermission('orderEdit')
  async updateAcceptOrderController(
    @Body() body: UpdateStatusOrderDTO,
    @Param() param: ParamIdDTO,
  ) {
    return this.OrderService.UpdateStatusOrderService(body, param);
  }
  // @Patch('/success/:id')
  // async updateSuccessOrderController(
  //   @Body() body: UpdateStatusOrderDTO,
  //   @Param() param: ParamIdDTO,
  // ) {
  //   return this.OrderService.UpdateSuccessOrderService(body, param);
  // }
}
