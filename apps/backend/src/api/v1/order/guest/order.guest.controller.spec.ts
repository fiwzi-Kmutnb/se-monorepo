import { Test, TestingModule } from '@nestjs/testing';
import { OrderGuestController } from './order.guest.controller';

describe('OrderGuestController', () => {
  let controller: OrderGuestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderGuestController],
    }).compile();

    controller = module.get<OrderGuestController>(OrderGuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
