import { FolderService } from './service/folder.service';
import { FolderController } from './controller/folder.controller';
import { Module } from '@nestjs/common';
import { FolderRepository } from './repository/folder.repository';
import { FileRepository } from '../file/repository/file.repository';

@Module({
  imports: [],
  controllers: [FolderController],
  providers: [FolderService, FolderRepository, FileRepository],
})
export class FolderModule {}
