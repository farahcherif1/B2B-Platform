import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WebsiteTabService } from '../services/website-tab.service';
import { CreateWebsiteTabDto } from '../dtos/create-website-tab.dto';
import { UpdateWebsiteTabDto } from '../dtos/update-website-tab.dto';

@Controller('website-tabs/event/:eventId')
export class WebsiteTabController {
  constructor(private readonly websiteTabService: WebsiteTabService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createWebsiteTabDto: CreateWebsiteTabDto,
  ) {
    return this.websiteTabService.createForEvent(eventId, createWebsiteTabDto);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.websiteTabService.findByEventId(eventId);
  }

  @Get(':id')
  findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.websiteTabService.findOne(id, eventId);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateWebsiteTabDto: UpdateWebsiteTabDto,
  ) {
    return this.websiteTabService.update(id, eventId, updateWebsiteTabDto);
  }

  @Delete(':id')
  remove(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return this.websiteTabService.remove(id, eventId);
  }
}
