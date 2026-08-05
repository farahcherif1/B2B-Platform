import { Test, TestingModule } from '@nestjs/testing';
import { FieldDependencyController } from './field-dependency.controller';

describe('FieldDependencyController', () => {
  let controller: FieldDependencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldDependencyController],
    }).compile();

    controller = module.get<FieldDependencyController>(FieldDependencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
