import { Language } from '../core-options/entities/language.entity';
import { DataSource } from 'typeorm';

export const languageSeed = async (dataSource: DataSource): Promise<void> => {
  const languageRepository = dataSource.getRepository(Language);
  const languagesToSeed = [
    { name: 'English' },
    { name: 'Français' },
    { name: 'Arabic' },
  ];
    for (const languageData of languagesToSeed) {
    const existingLanguage = await languageRepository.findOne({ 
      where: { name: languageData.name } 
    });
    
    if (!existingLanguage) {
      const newLanguage = languageRepository.create(languageData);
      await languageRepository.save(newLanguage);
      console.log(`Created language: ${languageData.name}`);
    } else {
      console.log(`Language ${languageData.name} already exists`);
    }
  }
};