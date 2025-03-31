import { Test, TestingModule } from '@nestjs/testing';
import { ChatRestrictedService } from './chat.restricted.service';

describe('ChatRestrictedService', () => {
  let service: ChatRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRestrictedService],
    }).compile();

    service = module.get<ChatRestrictedService>(ChatRestrictedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
