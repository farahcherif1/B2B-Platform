import { Test, TestingModule } from '@nestjs/testing';
import { TypeParticipantController } from './type-participant.controller';
import { TypeParticipantService } from '../services/type-participant.service';

describe('TypeParticipantController', () => {
  let controller: TypeParticipantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeParticipantController],
      providers: [TypeParticipantService],
    }).compile();

    controller = module.get<TypeParticipantController>(TypeParticipantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
