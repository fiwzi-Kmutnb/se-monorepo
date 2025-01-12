import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuestController } from './auth.guest.controller';

describe('AuthGuestController', () => {
  let controller: AuthGuestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGuestController],
    }).compile();

    controller = module.get<AuthGuestController>(AuthGuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
