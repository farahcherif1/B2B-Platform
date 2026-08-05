import { PartialType } from '@nestjs/swagger';
import { CreateTypeParticipantDto } from './create-type-participant.dto';

export class UpdateTypeParticipantDto extends PartialType(
  CreateTypeParticipantDto,
) {}
