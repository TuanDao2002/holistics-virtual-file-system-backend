import { FolderService } from './service/folder.service';
import { FolderController } from './controller/folder.controller';
import { Module } from '@nestjs/common';
import { FolderRepository } from "./repository/folder.repository";

@Module({
  imports: [],
  controllers: [FolderController],
  providers: [FolderService, FolderRepository],
})
export class FolderModule {}
