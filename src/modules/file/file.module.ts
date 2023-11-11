import { FileService } from './service/file.service';
import { Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';
import { FileRepository } from "./repository/file.repository";

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, FileRepository],
})
export class FileModule {}
