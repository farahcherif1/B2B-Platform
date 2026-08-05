import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleService {
  create(userRole: UserRole) {
    return 'This action adds a new userRole';
  }

  findAll() {
    return `This action returns all userRole`;
  }

  findOne(id: string) {
    return `This action returns a #${id} userRole`;
  }

  update(id: string, userRole: UserRole) {
    return `This action updates a #${id} userRole`;
  }

  remove(id: string) {
    return `This action removes a #${id} userRole`;
  }
}
