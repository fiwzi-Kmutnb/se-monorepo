import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastRestrictedController } from './broadcast.restricted.controller';

describe('BroadcastRestrictedController', () => {
  let controller: BroadcastRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastRestrictedController],
    }).compile();

    controller = module.get<BroadcastRestrictedController>(
      BroadcastRestrictedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
