import { NestFactory } from '@nestjs/core';

import { ConfigurationService } from '@app/common';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const config = app.get(ConfigurationService);
  await app.listen(config.get('API_PORT', 3000));
}
bootstrap();
