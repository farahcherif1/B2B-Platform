import { PartialType } from '@nestjs/swagger';
import { CreateTopicDto } from '../../core-options/dto/create-topic.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
