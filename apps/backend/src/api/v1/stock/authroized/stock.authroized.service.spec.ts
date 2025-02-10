import { Test, TestingModule } from '@nestjs/testing';
import { StockAuthroizedService } from './stock.authroized.service';

describe('StockAuthroizedService', () => {
  let service: StockAuthroizedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockAuthroizedService],
    }).compile();

    service = module.get<StockAuthroizedService>(StockAuthroizedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
