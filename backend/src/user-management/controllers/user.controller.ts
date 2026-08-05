import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateFilterDto } from '../dtos/user-dto/create-filter.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('assign-role')
  async assignRoleToUser(
    @Body() body: { userId: string; roleId: string; eventId: string },
  ): Promise<{ message: string }> {
    await this.userService.assignRoleToUser(
      body.userId,
      body.roleId,
      body.eventId,
    );
    return { message: 'Role assigned successfully' };
  }

  @Get('/organizers/:eventId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrganizers(
    @Param('eventId') eventId: string,
    @Query() filter: CreateFilterDto,
  ) {
    return await this.userService.getOrganizers(eventId, filter);
  }



  @Get('/:idEvent/:searchQuery?')
  async getUsers(
    @Param('idEvent') idEvent: string,
    @Param('searchQuery') searchQuery?: string,
  ) {
    return await this.userService.getUsers(idEvent, searchQuery);
  }

  @Delete('deleteOrganizer/:id')
  async deleteOrganizer(@Param('id') id: string) {
    await this.userService.deleteOrganizer(id);
    return { message: 'Organizer deleted successfully' };
  }
}
