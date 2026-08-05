import { DataSource } from 'typeorm';
import { languageSeed } from './language-seed';
import { userSeed } from './user-role-seed';
import { topicSeed } from './topic-seed';
import * as dotenv from 'dotenv';
import { sectionTypeSeed } from './section-type-seed';
dotenv.config(); // must come before DB connection setup


export const runSeeds = async (dataSource: DataSource): Promise<void> => {
  try {
    await languageSeed(dataSource);
    await topicSeed(dataSource);
    await userSeed(dataSource);
    await sectionTypeSeed(dataSource);

  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
};

if (require.main === module) {
  // Import the shared DataSource from typeorm.ts
  const { AppDataSource } = require('../config/typeorm');

  AppDataSource.initialize()
    .then(async () => {
      await runSeeds(AppDataSource);
      await AppDataSource.destroy();
    })
    .catch((error) => console.error('Error during initialization:', error));
}
