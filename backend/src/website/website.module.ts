import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteTab } from './entities/website-tab.entity';
import { Section } from './entities/section.entity';
import { SectionType } from '../core-options/entities/section-type.entity';
import { SectionService } from './services/section.service';
import { WebsiteTabService } from './services/website-tab.service';
import { WebsiteTabController } from './controllers/website.controller';
import { SectionController } from './controllers/section.controller';
import { ImageUrl } from './entities/image-url.entity';


@Module({
  imports: [TypeOrmModule.forFeature([WebsiteTab, Event,Section, SectionType, ImageUrl])],
  controllers: [WebsiteTabController,SectionController],
  providers: [SectionService,WebsiteTabService],
})
export class WebsiteModule {}
