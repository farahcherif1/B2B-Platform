import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from '../entities/topic.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    let topic = this.topicRepository.create(createTopicDto);
    return this.topicRepository.save(topic);
  }

  findAll(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  findOne(id: string): Promise<Topic | null> {
    return this.topicRepository.findOne({
      where: { id },
    });
  }

  update(id: string, updateTopicDto: UpdateTopicDto): Promise<UpdateResult> {
    return this.topicRepository.update(id, updateTopicDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.topicRepository.delete(id);
  }
}
