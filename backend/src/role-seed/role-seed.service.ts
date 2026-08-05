import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/user-management/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    let tmp = await this.roleRepository.find();
    let roles = tmp.map((role) => role.name);
    if (!roles.includes('OWNER')) {
      let role = this.roleRepository.create({
        name: 'OWNER',
        is_organizer_role: true,
      });
      await this.roleRepository.save(role);
      console.log('Role OWNER created');
    }
  }
}
