import { FolderModule } from './modules/folder/folder.module';
import { FileModule } from './modules/file/file.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/config/.env',
      isGlobal: true,
    }),
    FolderModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
