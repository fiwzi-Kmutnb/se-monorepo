import { Test, TestingModule } from '@nestjs/testing';
import { OrderRestrictedController } from './order.restricted.controller';

describe('OrderRestrictedController', () => {
  let controller: OrderRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderRestrictedController],
    }).compile();

    controller = module.get<OrderRestrictedController>(
      OrderRestrictedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
