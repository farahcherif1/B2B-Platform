import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRoleService } from '../services/user-role.service';
import { UserRole } from '../entities/user-role.entity';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  create(@Body() userRole: UserRole) {
    return this.userRoleService.create(userRole);
  }

  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRoleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userRole: UserRole) {
    return this.userRoleService.update(id, userRole);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRoleService.remove(id);
  }
}
