import { NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';

import { ConfigurationService } from '@app/common';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const config = app.get(ConfigurationService);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(config.get('API_PORT', 3000));
}
bootstrap();
