import { Test, TestingModule } from '@nestjs/testing';
import { DashboardAuthroizedController } from './dashboard.authroized.controller';

describe('DashboardAuthroizedController', () => {
  let controller: DashboardAuthroizedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardAuthroizedController],
    }).compile();

    controller = module.get<DashboardAuthroizedController>(
      DashboardAuthroizedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
