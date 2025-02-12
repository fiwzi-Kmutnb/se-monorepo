import { Test, TestingModule } from '@nestjs/testing';
import { ProductRestrictedController } from './product.restricted.controller';

describe('ProductRestrictedController', () => {
  let controller: ProductRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductRestrictedController],
    }).compile();

    controller = module.get<ProductRestrictedController>(
      ProductRestrictedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
