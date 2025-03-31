import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastRestrictedService } from './broadcast.restricted.service';

describe('BroadcastRestrictedService', () => {
  let service: BroadcastRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BroadcastRestrictedService],
    }).compile();

    service = module.get<BroadcastRestrictedService>(
      BroadcastRestrictedService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
