import { FileService } from './service/file.service';
import { Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
