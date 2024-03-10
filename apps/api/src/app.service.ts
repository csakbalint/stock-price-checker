import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
export class AppService implements OnModuleDestroy {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  async onModuleDestroy() {
    // We need this to close the server when it's reloaded in development environment
    // See: https://github.com/nestjs/nest/issues/11416
    const httpServer = this.httpAdapter.httpAdapter.getHttpServer();
    await new Promise((resolve) => httpServer.close(resolve));
  }
}
