import { FolderService } from './service/folder.service';
import { FolderController } from './controller/folder.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
