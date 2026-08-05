import { Topic } from '../core-options/entities/topic.entity';
import { DataSource } from 'typeorm';

export const topicSeed = async (dataSource: DataSource): Promise<void> => {
  const topicRepository = dataSource.getRepository(Topic);
  const topicsToSeed = [
    { name: 'Product & Service Support' },
    { name: 'Business & Strategy' },
    { name: 'Integrations' },
    { name: 'Technical Support' },
    { name: 'Sales & Marketing' },
    { name: 'Customer Success' },
    { name: 'Product Development' },
    { name: 'Finance & Accounting' },
    { name: 'Legal & Compliance' },
    { name: 'Human Resources' },
    { name: 'IT & Security' },
    { name: 'Operations & Logistics' },
    { name: 'Research & Development' },
    { name: 'Training & Education' },
    { name: 'Quality Assurance' },
  ];
  
  for (const topicData of topicsToSeed) {
    const existingTopic = await topicRepository.findOne({ 
      where: { name: topicData.name } 
    });
    
    if (!existingTopic) {
      const newTopic = topicRepository.create(topicData);
      await topicRepository.save(newTopic);
      console.log(`Created topic: ${topicData.name}`);
    } else {
      console.log(`Topic ${topicData.name} already exists`);
    }
  }
  };