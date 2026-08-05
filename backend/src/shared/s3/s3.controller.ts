import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post("uploadfile")
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.s3Service.uploadFile(file);
  }


  // Upload multiple files
  @Post('uploadfiles')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return this.s3Service.uploadFiles(files);
  }

  @Get('listfile')
  async list() {
    return this.s3Service.listFiles();
  }

  @Get('downloadfile/:fileName')
  async download(@Param('fileName') fileName: string, @Res() res) {
    const fileStream = await this.s3Service.downloadFile(fileName);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');
    fileStream.pipe(res);
  }

  @Delete('del/:fileName')
  async del(@Param('fileName') fileName: string) {
    return this.s3Service.deleteFile(fileName);
  }
}
