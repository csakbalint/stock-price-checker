import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { ConfigurationService } from '@app/common';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const config = app.get(ConfigurationService);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const documentBuilder = new DocumentBuilder()
    .setTitle('Advanced Stock Price Checker API')
    .setDescription('This is a simple API to check stock prices')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(config.get('API_PORT', 3000));
}
bootstrap();
