import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

export enum Access {
  Admin = 'admin',
  User = 'user',
  Organaizer = 'Organizer',
}

export function Auth(...access: Access[]) {
  return applyDecorators(
    SetMetadata('access', access),
    UseGuards(AuthGuard, RoleGuard),
  );
}
