import { Test, TestingModule } from '@nestjs/testing';
import { MemberRestrictedController } from './member.restricted.controller';

describe('MemberRestrictedController', () => {
  let controller: MemberRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberRestrictedController],
    }).compile();

    controller = module.get<MemberRestrictedController>(
      MemberRestrictedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
