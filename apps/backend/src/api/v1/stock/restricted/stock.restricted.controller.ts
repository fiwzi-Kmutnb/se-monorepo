import { StockRestrictedService } from './stock.restricted.service';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('v1/restricted/stock')
@UseGuards(AuthGuard)
export class StockRestrictedController {
  constructor(
    private readonly stockrestrictedService: StockRestrictedService,
  ) {}

  @Get('')
  async ViewStockController() {
    return this.stockrestrictedService.ViewStock();
  }
}
