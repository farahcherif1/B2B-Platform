import { Test, TestingModule } from '@nestjs/testing';
import { FieldDependencyService } from './field-dependency.service';

describe('FieldDependencyService', () => {
  let service: FieldDependencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldDependencyService],
    }).compile();

    service = module.get<FieldDependencyService>(FieldDependencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
