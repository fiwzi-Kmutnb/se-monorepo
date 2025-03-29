import { Test, TestingModule } from '@nestjs/testing';
import { ChatRestrictedController } from './chat.restricted.controller';

describe('ChatRestrictedController', () => {
  let controller: ChatRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRestrictedController],
    }).compile();

    controller = module.get<ChatRestrictedController>(ChatRestrictedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
