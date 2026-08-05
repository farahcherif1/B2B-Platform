import { DataSource } from 'typeorm';
import { SectionType } from '../core-options/entities/section-type.entity';

export const sectionTypeSeed = async (dataSource: DataSource): Promise<void> => {
  const sectionTypeRepository = dataSource.getRepository(SectionType);

  const sectionTypesToSeed = [
    { name: 'title' },
    { name: 'title and description' },
    { name: 'title and description and image' },
    { name: 'title and image' },
    { name: 'image' },
  ];

  for (const typeData of sectionTypesToSeed) {
    const existing = await sectionTypeRepository.findOne({
      where: { name: typeData.name },
    });

    if (!existing) {
      const newType = sectionTypeRepository.create(typeData);
      await sectionTypeRepository.save(newType);
      console.log(`Created section type: ${typeData.name}`);
    } else {
      console.log(`Section type "${typeData.name}" already exists`);
    }
  }
};
