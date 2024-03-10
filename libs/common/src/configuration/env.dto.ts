import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL!: string;

  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  API_PORT!: number;

  @IsString()
  FINNHUB_API_KEY!: string;

  @IsNumber()
  STOCK_HISTORY_SIZE!: number;

  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  REDIS_PORT!: number;

  @IsString()
  REDIS_PASSWORD!: string;
}
