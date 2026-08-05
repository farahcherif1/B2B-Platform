import { Test, TestingModule } from '@nestjs/testing';
import { TypeParticipantService } from './type-participant.service';

describe('TypeParticipantService', () => {
  let service: TypeParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeParticipantService],
    }).compile();

    service = module.get<TypeParticipantService>(TypeParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
