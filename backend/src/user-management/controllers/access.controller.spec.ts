import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from '../controllers/access.controller';
import { AccessService } from '../services/access.service';

describe('AccessController', () => {
  let controller: AccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [AccessService],
    }).compile();

    controller = module.get<AccessController>(AccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
