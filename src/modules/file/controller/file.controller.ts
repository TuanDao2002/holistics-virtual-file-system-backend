import { Controller, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { FileService } from '../service/file.service';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.OK)
  @Get('file')
  async getFileContent(
    @Query('file_name') fileName: string,
    @Query('path') path: string = null,
  ): Promise<string> {
    return await this.fileService.getFileContent(fileName, path);
  }
}
