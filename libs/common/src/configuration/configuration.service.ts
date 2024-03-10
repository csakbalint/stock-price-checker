import { Injectable } from '@nestjs/common';
import { ConfigService, NoInferType } from '@nestjs/config';
import { isUndefined } from 'lodash';

import { EnvironmentVariables } from './env.dto';

@Injectable()
export class ConfigurationService {
  constructor(private readonly config: ConfigService) {}

  get<Key extends keyof EnvironmentVariables>(
    propertyPath: Key,
  ): EnvironmentVariables[Key] | undefined;
  get<Key extends keyof EnvironmentVariables>(
    propertyPath: Key,
    defaultValue?: NoInferType<EnvironmentVariables[Key]>,
  ): EnvironmentVariables[Key];
  get<Key extends keyof EnvironmentVariables>(
    propertyPath: Key,
    defaultValue?: NoInferType<EnvironmentVariables[Key]>,
  ): EnvironmentVariables[Key] | undefined {
    return isUndefined(defaultValue)
      ? this.config.get(propertyPath)
      : this.config.get(propertyPath, defaultValue);
  }
}
