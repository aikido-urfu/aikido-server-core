import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as serveStatic from 'serve-static';

async function bootstrap() {
  const server = express();
  server.use('/uploads', serveStatic(join(__dirname, '..', 'uploads'))); // Указывает папку с файлами

  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });

  const config = new DocumentBuilder()
    .setTitle('Aikido')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3005);
}

bootstrap();
