import { Test, TestingModule } from '@nestjs/testing';
import { AuthAuthroizedService } from './auth.authroized.service';

describe('AuthAuthroizedService', () => {
  let service: AuthAuthroizedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthAuthroizedService],
    }).compile();

    service = module.get<AuthAuthroizedService>(AuthAuthroizedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
