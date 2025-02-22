import { ProductRestrictedService } from './product.restricted.service';
import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthGuard } from 'src/utils/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('v1/restricted/stock')
@UseGuards(AuthGuard)
export class ProductRestrictedController {
  constructor(
    private readonly productrestrictedService: ProductRestrictedService,
  ) {}

  @Get('')
  async ViewStockController() {
    return this.productrestrictedService.ViewStock();
  }
}
