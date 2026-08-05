import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { isOrganizer } from '../guards/isOrganizer.guard';

export function Organaizer() {
  return applyDecorators(UseGuards(AuthGuard, isOrganizer));
}
