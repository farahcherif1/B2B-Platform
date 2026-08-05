import { Test, TestingModule } from '@nestjs/testing';
import { FieldService } from './field.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Field } from '../entities/field.entity';
import { Access } from 'src/user-management/entities/access.entity';
import { Choice } from 'src/core-options/entities/choice.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateFieldDto } from '../dtos/field-dto/update-field.dto';
import { CreateFieldDto } from '../dtos/field-dto/create-field.dto';
import { FieldType } from '../../shared/enum/FieldType';

describe('FieldService', () => {
  let service: FieldService;
  let fieldRepository: Repository<Field>;
  let permissionRepository: Repository<Access>;
  let choiceRepository: Repository<Choice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FieldService,
        {
          provide: getRepositoryToken(Field),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Access),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Choice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FieldService>(FieldService);
    fieldRepository = module.get<Repository<Field>>(getRepositoryToken(Field));
    permissionRepository = module.get<Repository<Access>>(
      getRepositoryToken(Access),
    );
    choiceRepository = module.get<Repository<Choice>>(
      getRepositoryToken(Choice),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of fields', async () => {
      const result = [new Field()];
      jest.spyOn(fieldRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a field', async () => {
      const result = new Field();
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw a NotFoundException if field not found', async () => {
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a field', async () => {
      const createFieldDto: CreateFieldDto = {
        title: 'Test Field',
        type: FieldType.TEXT,
        description: 'Test Description',
        permissionId: 1,
        required: true,
        relatedFieldId: 1,
        choiceIds: [1, 2],
      };

      const permission = new Access();
      const relatedField = new Field();
      const choices = [new Choice(), new Choice()];

      const transformedDto = {
        title: 'Test Field',
        type: FieldType.TEXT,
        description: 'Test Description',
        permission,
        required: true,
        relatedField,
        choices,
      };

      const result = new Field();
      jest.spyOn(fieldRepository, 'create').mockReturnValue(result);
      jest.spyOn(fieldRepository, 'save').mockResolvedValue(result);
      jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(permission);
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(relatedField);
      jest.spyOn(choiceRepository, 'findByIds').mockResolvedValue(choices);

      expect(await service.create(createFieldDto)).toBe(result);
      expect(fieldRepository.create).toHaveBeenCalledWith(transformedDto);
      expect(fieldRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('update', () => {
    it('should update and return a field', async () => {
      const updateFieldDto: UpdateFieldDto = {
        id: 1,
        title: 'Updated Field',
        type: FieldType.TEXT,
        description: 'Updated Description',
        permissionId: 1,
        required: true,
        relatedFieldId: 1,
        choiceIds: [1, 2],
      };
      const result = new Field();
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(result);
      jest.spyOn(fieldRepository, 'save').mockResolvedValue(result);
      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(new Access());
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(new Field());
      jest
        .spyOn(choiceRepository, 'findByIds')
        .mockResolvedValue([new Choice(), new Choice()]);

      expect(await service.update(updateFieldDto)).toBe(result);
    });

    it('should throw a NotFoundException if field not found', async () => {
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update({ id: 1 } as UpdateFieldDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a field', async () => {
      const result = new Field();
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(result);
      jest.spyOn(fieldRepository, 'remove').mockResolvedValue(result);

      await service.remove(1);
      expect(fieldRepository.remove).toHaveBeenCalledWith(result);
    });

    it('should throw a NotFoundException if field not found', async () => {
      jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
