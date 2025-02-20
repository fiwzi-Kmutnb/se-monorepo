import { Test, TestingModule } from '@nestjs/testing';
import { ProductRestrictedService } from './product.restricted.service';

describe('ProductRestrictedService', () => {
  let service: ProductRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRestrictedService],
    }).compile();

    service = module.get<ProductRestrictedService>(ProductRestrictedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
