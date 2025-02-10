import { Test, TestingModule } from '@nestjs/testing';
import { StockAuthroizedController } from './stock.authroized.controller';

describe('StockAuthroizedController', () => {
  let controller: StockAuthroizedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockAuthroizedController],
    }).compile();

    controller = module.get<StockAuthroizedController>(
      StockAuthroizedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
