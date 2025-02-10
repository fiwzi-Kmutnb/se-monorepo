import { Test, TestingModule } from '@nestjs/testing';
import { StockRestrictedController } from './stock.restricted.controller';

describe('StockRestrictedController', () => {
  let controller: StockRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockRestrictedController],
    }).compile();

    controller = module.get<StockRestrictedController>(StockRestrictedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
