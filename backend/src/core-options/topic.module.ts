import { Module } from '@nestjs/common';
import { TopicService } from './services/topic.service';
import { TopicController } from './controllers/topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
