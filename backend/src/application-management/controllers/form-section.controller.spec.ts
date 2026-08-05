import { Test, TestingModule } from '@nestjs/testing';
import { FormSectionController } from './form-section.controller';

describe('FormSectionController', () => {
  let controller: FormSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormSectionController],
    }).compile();

    controller = module.get<FormSectionController>(FormSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
