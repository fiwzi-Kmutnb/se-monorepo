import { Test, TestingModule } from '@nestjs/testing';
import { OrderRestrictedService } from './order.restricted.service';

describe('OrderRestrictedService', () => {
  let service: OrderRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderRestrictedService],
    }).compile();

    service = module.get<OrderRestrictedService>(OrderRestrictedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
