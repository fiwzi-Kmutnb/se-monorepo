import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRestrictedController } from './permission.restricted.controller';

describe('PermissionRestrictedController', () => {
  let controller: PermissionRestrictedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionRestrictedController],
    }).compile();

    controller = module.get<PermissionRestrictedController>(
      PermissionRestrictedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
