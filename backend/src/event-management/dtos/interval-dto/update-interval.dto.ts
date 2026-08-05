import { PartialType } from '@nestjs/swagger';
import { CreateIntervalDto } from './create-interval.dto';

export class UpdateIntervalDto extends PartialType(CreateIntervalDto) {}
