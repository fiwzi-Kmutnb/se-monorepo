import { Test, TestingModule } from '@nestjs/testing';
import { ProductAuthroizedService } from './product.authroized.service';

describe('ProductAuthroizedService', () => {
  let service: ProductAuthroizedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAuthroizedService],
    }).compile();

    service = module.get<ProductAuthroizedService>(ProductAuthroizedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
