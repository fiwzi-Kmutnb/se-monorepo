import { Test, TestingModule } from '@nestjs/testing';
import { ProductAuthroizedController } from './product.authroized.controller';

describe('ProductAuthroizedController', () => {
  let controller: ProductAuthroizedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAuthroizedController],
    }).compile();

    controller = module.get<ProductAuthroizedController>(
      ProductAuthroizedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
