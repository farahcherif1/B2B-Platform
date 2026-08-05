import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
@Injectable()
export class isOrganizer implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const is_organizer = user.is_organizer;

    if (!is_organizer) {
      throw new ForbiddenException('You do not have the required access');
    }

    return true;
  }
}
