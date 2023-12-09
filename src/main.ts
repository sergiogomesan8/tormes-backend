import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Permite solo este origen
  });

  const config = new DocumentBuilder()
    .setTitle('Tormes Api')
    .setDescription('Tormes API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Tormes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api' + '/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
