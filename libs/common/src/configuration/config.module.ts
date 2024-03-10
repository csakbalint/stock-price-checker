import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigurationService } from './configuration.service';
import { validate } from './env.validation';

@Module({
  imports: [ConfigModule.forRoot({ validate })],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
