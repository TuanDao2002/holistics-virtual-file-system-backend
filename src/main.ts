import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Constant } from './common/constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  await app.listen(Constant.PORT);
  console.log(`Server listening on port: ${Constant.PORT}`);
}
bootstrap();
