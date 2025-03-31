import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuestService } from './auth.guest.service';

describe('AuthGuestService', () => {
  let service: AuthGuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuestService],
    }).compile();

    service = module.get<AuthGuestService>(AuthGuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
