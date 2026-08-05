import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/user-management/services/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.get<string[]>(
      'access',
      context.getHandler(),
    );
    if (!requiredAccess || requiredAccess.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || !user.role.id) {
      throw new ForbiddenException('User role not found');
    }

    const role = await this.roleService.findOne(user.role.id);
    if (!role || !role.accesses || role.accesses.length === 0) {
      throw new ForbiddenException('Role or accesses not properly defined');
    }

    const hasAccess = requiredAccess.some((access) =>
      role.accesses.some((roleAccess) => roleAccess.name === access),
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have the required access');
    }

    return true;
  }
}
