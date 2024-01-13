import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const basePath = process.env.BASE_PATH;
  app.setGlobalPrefix(basePath);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://tormes-frontend-c9e2b3d2e8ef.herokuapp.com',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('Tormes Api')
    .setDescription('Tormes API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Tormes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(basePath + '/swagger', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
