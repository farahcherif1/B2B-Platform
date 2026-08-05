import { Test, TestingModule } from '@nestjs/testing';
import { FormSectionService } from './form-section.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormSection } from '../entities/form-section.entity';
import { Event } from '../../event-management/entities/event.entity';
import { Field } from '../entities/field.entity';
import { Repository } from 'typeorm';

describe('FormSectionService', () => {
  let service: FormSectionService;
  let formSectionRepository: Repository<FormSection>;
  let eventRepository: Repository<Event>;
  let fieldRepository: Repository<Field>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormSectionService,
        {
          provide: getRepositoryToken(FormSection),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Field),
          useValue: {
            findByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FormSectionService>(FormSectionService);
    formSectionRepository = module.get<Repository<FormSection>>(
      getRepositoryToken(FormSection),
    );
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    fieldRepository = module.get<Repository<Field>>(getRepositoryToken(Field));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of form sections', async () => {
      const result = [new FormSection()];
      jest.spyOn(formSectionRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a form section', async () => {
      const result = new FormSection();
      jest.spyOn(formSectionRepository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw an error if form section not found', async () => {
      jest.spyOn(formSectionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        'Form section not found',
      );
    });
  });

  describe('create', () => {
    it('should create and return a form section', async () => {
      const createFormSectionDto = {
        name: 'Test Form Section',
        eventId: 1,
        fieldIds: [1, 2],
      };
      const event = new Event();
      const fields = [new Field(), new Field()];
      const result = new FormSection();

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest.spyOn(fieldRepository, 'findByIds').mockResolvedValue(fields);
      jest.spyOn(formSectionRepository, 'create').mockReturnValue(result);
      jest.spyOn(formSectionRepository, 'save').mockResolvedValue(result);

      expect(await service.create(createFormSectionDto)).toBe(result);
      expect(formSectionRepository.create).toHaveBeenCalledWith({
        name: createFormSectionDto.name,
        event,
        fields,
      });
      expect(formSectionRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw an error if event not found', async () => {
      const createFormSectionDto = {
        name: 'Test Form Section',
        eventId: 1,
        fieldIds: [1, 2],
      };

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createFormSectionDto)).rejects.toThrow(
        'Event not found',
      );
    });
  });

  describe('getFields', () => {
    it('should return fields of a form section', async () => {
      const formSection = new FormSection();
      formSection.fields = [new Field(), new Field()];

      jest
        .spyOn(formSectionRepository, 'findOne')
        .mockResolvedValue(formSection);

      expect(await service.getFields(1)).toBe(formSection.fields);
    });

    it('should throw an error if form section not found', async () => {
      jest.spyOn(formSectionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getFields(1)).rejects.toThrow(
        'Form section not found',
      );
    });
  });
});
