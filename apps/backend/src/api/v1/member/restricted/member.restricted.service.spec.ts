import { Test, TestingModule } from '@nestjs/testing';
import { MemberRestrictedService } from './member.restricted.service';

describe('MemberRestrictedService', () => {
  let service: MemberRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberRestrictedService],
    }).compile();

    service = module.get<MemberRestrictedService>(MemberRestrictedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
