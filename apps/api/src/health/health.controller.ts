import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { ConfigurationService } from '@app/common';
import { DatabaseService } from '@app/database';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ConfigurationService,
    private readonly db: DatabaseService,
    private readonly dbHealth: PrismaHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    // TODO: create custom health indicator for redis
    // FIXME: remove @nestjs/microservices as we are using it only for healthcheck
    private readonly redis: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  isHealthy() {
    return this.health.check([
      () => this.dbHealth.pingCheck('prisma', this.db),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.redis.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            // Set your options just like you configure your BullModule
            host: this.config.get('REDIS_HOST', 'localhost'),
            port: this.config.get('REDIS_PORT', 6379),
          },
        }),
    ]);
  }
}
