import { AuthGuard } from 'src/utils/jwt.guard';
import { DashboardAuthroizedService } from './dashboard.authroized.service';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { RequirePermission } from 'src/decorators/permission.decorator';
import { SaleDashboardDTO } from './dashboard.authroized.dto';

@Controller('v1/authroized/dashboard')
@UseGuards(AuthGuard)
export class DashboardAuthroizedController {
  constructor(private readonly dashboardService: DashboardAuthroizedService) {}

  @Get('/sales')
  @RequirePermission('dashboardAnalysis')
  async GetSalesAnalysisController() {
    return this.dashboardService.GetSalesAnalysisService();
  }
  @Get('/sales/range')
  @RequirePermission('dashboardAnalysis')
  async GetSalesAnalysisRangeController(@Body() body: SaleDashboardDTO) {
    return this.dashboardService.GetSalesAnalysisRangeService(body);
  }
}
