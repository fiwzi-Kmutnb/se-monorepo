import { Test, TestingModule } from '@nestjs/testing';
import { OrderGuestService } from './order.guest.service';

describe('OrderGuestService', () => {
  let service: OrderGuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderGuestService],
    }).compile();

    service = module.get<OrderGuestService>(OrderGuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
