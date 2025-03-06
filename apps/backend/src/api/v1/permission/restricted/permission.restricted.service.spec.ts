import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRestrictedService } from './permission.restricted.service';

describe('PermissionRestrictedService', () => {
  let service: PermissionRestrictedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionRestrictedService],
    }).compile();

    service = module.get<PermissionRestrictedService>(
      PermissionRestrictedService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
