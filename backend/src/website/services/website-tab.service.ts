import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteTab } from '../entities/website-tab.entity';
import { CreateWebsiteTabDto } from '../dtos/create-website-tab.dto';
import { UpdateWebsiteTabDto } from '../dtos/update-website-tab.dto';

@Injectable()
export class WebsiteTabService {
  constructor(
    @InjectRepository(WebsiteTab)
    private websiteTabRepository: Repository<WebsiteTab>,
  ) {}

  async createForEvent(eventId: string, dto: CreateWebsiteTabDto) {
    return this.websiteTabRepository.save({
      ...dto,
      event: { id: eventId }, // assuming you're using a relation
    });
  }

  async findByEventId(eventId: string) {
    return this.websiteTabRepository.find({
      where: { event: { id: eventId } },
      relations: ['event'], // optional, if you want event data too
    });
  }

  async findOne(id: string, eventId: string): Promise<WebsiteTab> {
    return this.websiteTabRepository.findOne({
      where: {
        id,
        event: { id: eventId },
      },
      relations: ['event', 'sections'],
    });
  }
  
  async update(id: string, eventId: string, updateWebsiteTabDto: UpdateWebsiteTabDto): Promise<WebsiteTab> {
    const tab = await this.findOne(id, eventId);
    if (!tab) {
      throw new Error('WebsiteTab not found for this event');
    }
  
    await this.websiteTabRepository.update(id, updateWebsiteTabDto);
    return this.findOne(id, eventId);
  }
  
  async remove(id: string, eventId: string): Promise<void> {
    const tab = await this.findOne(id, eventId);
    if (!tab) {
      throw new Error('WebsiteTab not found for this event');
    }
  
    await this.websiteTabRepository.delete(id);
  }
  
}
