import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChoiceService } from '../services/choice.service';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';

@Controller('choice')
export class ChoiceController {
  constructor(private choiceService: ChoiceService) {}

  @Get()
  async findAll() {
    return this.choiceService.findAll();
  }

  @Post()
  @Organaizer()
  async create(@Body() body: { name: string }) {
    return this.choiceService.create(body.name);
  }

  @Put(':id')
  @Organaizer()
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.choiceService.update(id, body.name);
  }

  @Delete(':id')
  @Organaizer()
  async remove(@Param('id') id: string) {
    return this.choiceService.remove(id);
  }
}
