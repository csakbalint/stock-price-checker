import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { ConfigurationModule } from '@app/common';
import { DatabaseModule } from '@app/database';

import { HealthController } from './health.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
