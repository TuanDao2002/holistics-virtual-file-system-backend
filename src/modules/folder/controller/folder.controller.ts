import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { FolderService } from '../service/folder.service';
import { CreateFolderDTO } from '../dto/create-folder.dto';

@Controller()
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @HttpCode(HttpStatus.OK)
  @Get('folder')
  async listFolder(@Query('path') folderPath: string): Promise<any> {
    return await this.folderService.listFolder(folderPath);
  }

  @HttpCode(HttpStatus.OK)
  @Post('folder')
  async createFolder(@Body() folderData: CreateFolderDTO): Promise<{
    name: string;
    id: number;
    path: string;
  }> {
    return await this.folderService.createFolder(folderData);
  }
}
