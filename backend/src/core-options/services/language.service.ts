import { Injectable } from "@nestjs/common";
import { Language } from "../entities/language.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class LanguageService {
  constructor(
      @InjectRepository(Language)
      private languageRepository: Repository<Language>,
  ) {
  }

  async create(createLanguageDto: Language): Promise<Language> {
    let language = this.languageRepository.create(createLanguageDto);
    return this.languageRepository.save(language);
  }

  findAll(): Promise<Language[]> {
    return this.languageRepository.find();
  }

  findOne(id: string): Promise<Language | null> {
    return this.languageRepository.findOne(
        {where: {id}}
    );
  }

  update(id: string, updateLanguageDto: Language) {
    return this.languageRepository.update(id, updateLanguageDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.languageRepository.delete(id);
  }
}