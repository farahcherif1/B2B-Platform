import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LanguageService } from '../services/language.service';
import { Language } from '../entities/language.entity';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  @Get()
  getAllLanguages() {
    return this.languageService.findAll();
  }
  @Get(':id')
  getLanguageById(@Param('id') id: string) {
    return this.languageService.findOne(id);
  }

  @Post()
  createLanguage(@Body() createLanguageDto: Language) {
    return this.languageService.create(createLanguageDto);
  }

  @Put(':id')
  updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: Language) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  deleteLanguage(@Param('id') id: string) {
    return this.languageService.remove(id);
  }
}
