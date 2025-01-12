import { Test, TestingModule } from '@nestjs/testing';
import { AuthAuthroizedController } from './auth.authroized.controller';

describe('AuthAuthroizedController', () => {
  let controller: AuthAuthroizedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAuthroizedController],
    }).compile();

    controller = module.get<AuthAuthroizedController>(AuthAuthroizedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
