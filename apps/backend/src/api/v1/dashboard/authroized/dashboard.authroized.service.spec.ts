import { Test, TestingModule } from '@nestjs/testing';
import { DashboardAuthroizedService } from './dashboard.authroized.service';

describe('DashboardAuthroizedService', () => {
  let service: DashboardAuthroizedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardAuthroizedService],
    }).compile();

    service = module.get<DashboardAuthroizedService>(
      DashboardAuthroizedService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
