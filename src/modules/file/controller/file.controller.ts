import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { FileService } from '../service/file.service';
import { CreateFileDTO } from '../dto/create-file.dto';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.OK)
  @Get('file')
  async getFileContent(@Query('file_path') filePath: string): Promise<string> {
    return await this.fileService.getFileContent(filePath);
  }

  @HttpCode(HttpStatus.OK)
  @Post('file')
  async createFile(@Body() fileDTO: CreateFileDTO): Promise<{
    name: string;
    id: number;
    path: string;
  }> {
    return await this.fileService.createFile(fileDTO);
  }
}
