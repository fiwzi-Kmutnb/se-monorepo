import { Test, TestingModule } from '@nestjs/testing';
import { StockRestrictedService } from './stock.restricted.service';

describe('StockRestrictedService', () => {
  let service: StockRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockRestrictedService],
    }).compile();

    service = module.get<StockRestrictedService>(StockRestrictedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
