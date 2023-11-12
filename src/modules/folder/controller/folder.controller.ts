import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FolderService } from '../service/folder.service';
import { CreateFolderDTO } from '../dto/create-folder.dto';
import { Response } from 'express';
import { MoveFileOrFolderDTO } from '../dto/move-file-folder.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('folder/remove')
  async removeFilesOrFolders(
    @Body('paths') paths: string[],
    @Res() res: Response,
  ): Promise<void> {
    await this.folderService.removeFilesOrFolders(paths);
    res.json({ msg: 'Successfully complete' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('folder/move')
  async moveFilesOrFolders(
    @Body() body: MoveFileOrFolderDTO,
    @Res() res: Response,
  ): Promise<void> {
    await this.folderService.moveFileOrFolder(body.path, body.folderPath);
    res.json({ msg: 'Successfully complete' });
  }
}
