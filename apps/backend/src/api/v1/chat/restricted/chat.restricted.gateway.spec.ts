import { Test, TestingModule } from '@nestjs/testing';
import { ChatRestrictedGateway } from './chat.restricted.gateway';

describe('ChatRestrictedGateway', () => {
  let gateway: ChatRestrictedGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatRestrictedGateway],
    }).compile();

    gateway = module.get<ChatRestrictedGateway>(ChatRestrictedGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
