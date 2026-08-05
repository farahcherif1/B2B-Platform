import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dtos/role-dto/create-role.dto';
import { UpdateRoleDto } from '../dtos/role-dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Post('add-access')
  async assignRoleToUser(
    @Body() body: { accessId: string; roleId: string },
  ): Promise<{ message: string }> {
    await this.roleService.addAccessToRole(body.roleId, body.accessId);
    return { message: 'Access assigned successfully' };
  }
}
