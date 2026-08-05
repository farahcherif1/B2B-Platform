import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/role-dto/create-role.dto';
import { UpdateRoleDto } from '../dtos/role-dto/update-role.dto';
import { Role } from '../entities/role.entity';
import { AccessService } from 'src/user-management/services/access.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private accessService: AccessService
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id },relations:['accesses'] });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async addAccessToRole(roleId: string, accessId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['accesses'] });
    if (!role) {
      throw new NotFoundException("Role not Found")
    }

    const access = await this.accessService.findOne(accessId);
    if (!access){
      throw new NotFoundException("Access Not Found")
    }
    role.accesses.push(access);
    return this.roleRepository.save(role);
  }
}
