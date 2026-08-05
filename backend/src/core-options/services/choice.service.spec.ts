import { Test, TestingModule } from '@nestjs/testing';
import { ChoiceService } from '../services/choice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Choice } from '../entities/choice.entity';
import { Repository } from 'typeorm';

describe('ChoiceService', () => {
  let service: ChoiceService;
  let choiceRepository: Repository<Choice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoiceService,
        {
          provide: getRepositoryToken(Choice),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChoiceService>(ChoiceService);
    choiceRepository = module.get<Repository<Choice>>(
      getRepositoryToken(Choice),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a choice', async () => {
      const name = 'Test Choice';
      const result = new Choice();
      result.name = name;

      jest.spyOn(choiceRepository, 'save').mockResolvedValue(result);

      expect(await service.create(name)).toBe(result);
      expect(choiceRepository.save).toHaveBeenCalledWith({ name });
    });
  });

  describe('findAll', () => {
    it('should return an array of choices', async () => {
      const result = [new Choice()];
      jest.spyOn(choiceRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });
});
