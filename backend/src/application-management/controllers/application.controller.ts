import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/core/decorators/get-user.decorator';
import { ApplicationPersonalInformationDto } from '../dtos/application-dto/ApplicationPersonalInformation.dto';
import { ApplicationOrganisationInformationDto } from '../dtos/application-dto/ApplicationOrganisationInformation.dto';
import { ApplicationAdressDto } from '../dtos/application-dto/ApplicationAdress.dto';
import { Organaizer } from 'src/auth/core/decorators/organizer.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFilterDto } from 'src/user-management/dtos/user-dto/create-filter.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }

  @UseGuards(AuthGuard())
  @Get('userApplications/:id')
  getUserApplications(@GetUser() user, @Param('id') id: string) {
    return this.applicationService.getUserApplications(user.userId, id);
  }

  @UseGuards(AuthGuard())
  @Post('PersonnalInfo/:id')
  createPersonnalInfo(
    @Param('id') id: string,
    @GetUser() user,
    @Body()
    applicationPersonalInformationDto: ApplicationPersonalInformationDto,
  ) {
    return this.applicationService.createPersonnalInfo(
      id,
      applicationPersonalInformationDto,
      user.userId,
    );
  }

  @UseGuards(AuthGuard())
  @Post('OrganisationInfo/:id')
  createOrganisationInfo(
    @Param('id') id: string,
    @GetUser() user,
    @Body()
    applicationPersonalInformationDto: ApplicationOrganisationInformationDto,
  ) {
    return this.applicationService.createOrganisationInfo(
      id,
      applicationPersonalInformationDto,
      user.userId,
    );
  }

  @UseGuards(AuthGuard())
  @Post('Address/:id')
  createAddress(
    @Param('id') id: string,
    @GetUser() user,
    @Body() applicationPersonalInformationDto: ApplicationAdressDto,
  ) {
    return this.applicationService.createAddress(
      id,
      applicationPersonalInformationDto,
      user.userId,
    );
  }

  @UseGuards(AuthGuard())
  @Post('Questions/:id')
  addQuestions(
    @Param('id') id: string,
    @Body() questions: string,
    @GetUser() user,
  ) {
    return this.applicationService.addQuestions(id, questions, user.userId);
  }

  @UseGuards(AuthGuard())
  @Post('/submit/:id')
  submitApplication(@Param('id') id: string, @GetUser() user) {
    return this.applicationService.createApplication(id, user.userId);
  }

  @UseGuards(AuthGuard())
  @Organaizer()
  @Get('eventApplications/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getEventApplications(
    @Param('id') id: string,
    @Query() filter: CreateFilterDto,
  ) {
    return this.applicationService.getEventApplications(id, filter);
  }

  @UseGuards(AuthGuard())
  @Organaizer()
  @Post('/exportParticipants')
  exportParticipants(@Body() participants: any[], @Res() res: Response) {
    this.applicationService.exportParticipants(participants, res);
  }

  @UseGuards(AuthGuard())
  @Organaizer()
  @Post('/exportOrganizers')
  exportOrganizers(@Body() organizers: any[], @Res() res: Response) {
    organizers = organizers.map((participant) => ({
      ...participant,
      roles: participant.roles.join(', '),
    }));
    this.applicationService.exportOrganizers(organizers, res);
  }

  @UseGuards(AuthGuard())
  @Organaizer()
  @Post('importParticipants/:id')
  @UseInterceptors(FileInterceptor('file'))
  async importParticipants(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return await this.applicationService.importParticipants(file, id);
  }
}
