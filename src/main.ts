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

  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://tormes-frontend.netlify.app']
      : ['http://localhost:4200', 'https://tormes-frontend.netlify.app'];
  app.enableCors({
    origin: allowedOrigins,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tormes Api')
      .setDescription('Tormes API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Tormes')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(basePath + '/swagger', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
