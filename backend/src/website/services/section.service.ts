import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/section.entity';
import { CreateSectionDto } from '../dtos/create-section.dto';
import { UpdateSectionDto } from '../dtos/update-section.dto';
import { WebsiteTab } from '../entities/website-tab.entity';
import { SectionType } from 'src/core-options/entities/section-type.entity';
import { ImageUrl } from '../entities/image-url.entity'; 

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

    @InjectRepository(WebsiteTab)
    private websiteTabRepository: Repository<WebsiteTab>,

    @InjectRepository(SectionType)
    private sectionTypeRepository: Repository<SectionType>,

    @InjectRepository(ImageUrl)
    private imageUrlRepository: Repository<ImageUrl>, // Inject ImageUrl repository
  ) {}

  async create(tabId: string, createSectionDto: CreateSectionDto): Promise<Section> {
    const websiteTab = await this.websiteTabRepository.findOneBy({ id: tabId });

    const sectionType = createSectionDto.sectionTypeId
      ? await this.sectionTypeRepository.findOneBy({ id: createSectionDto.sectionTypeId })
      : null;

    const section = new Section();
    section.title = createSectionDto.title;
    section.description = createSectionDto.description;
    section.websiteTab = websiteTab;
    section.type = sectionType;

    // Map imageUrls to ImageUrl entities
    if (createSectionDto.imageUrls?.length) {
      section.images = createSectionDto.imageUrls.map((url) => {
        const image = new ImageUrl();
        image.url = url;
        image.section = section;
        return image;
      });
    }

    return this.sectionRepository.save(section);
  }

  async findAllByTabId(tabId: string): Promise<Section[]> {
    return this.sectionRepository.find({
      where: { websiteTab: { id: tabId } },
      relations: ['websiteTab', 'type', 'images'], //  include images
    });
  }

  async findOne(tabId: string, sectionId: string): Promise<Section> {
    return this.sectionRepository.findOne({
      where: { id: sectionId, websiteTab: { id: tabId } },
      relations: ['websiteTab', 'type', 'images'], //  include images
    });
  }

  async update(tabId: string, sectionId: string, dto: UpdateSectionDto): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, websiteTab: { id: tabId } },
      relations: ['websiteTab', 'images'],
    });

    if (!section) throw new Error('Section not found for this tab');

    if (dto.websiteTabId && dto.websiteTabId !== tabId) {
      section.websiteTab = await this.websiteTabRepository.findOneBy({ id: dto.websiteTabId });
    }

    if (dto.sectionTypeId) {
      section.type = await this.sectionTypeRepository.findOneBy({ id: dto.sectionTypeId });
    }

    section.title = dto.title ?? section.title;
    section.description = dto.description ?? section.description;

    // Handle updated imageUrls
    if (dto.imageUrls) {
      // Remove existing images
      await this.imageUrlRepository.delete({ section: { id: section.id } });

      // Add new images
      section.images = dto.imageUrls.map((url) => {
        const image = new ImageUrl();
        image.url = url;
        image.section = section;
        return image;
      });
    }

    return this.sectionRepository.save(section);
  }

  async remove(tabId: string, sectionId: string): Promise<void> {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, websiteTab: { id: tabId } },
    });

    if (!section) throw new Error('Section not found for this tab');

    await this.sectionRepository.remove(section);
  }
}
