import path from 'path';
import { EnvironmentTypes } from './injection';

export interface AppConfig {
  port: number | string;
  publicDir?: string;
  environmentMode: EnvironmentTypes;
}

export const appConfigCreatingFunction = (
  environmentMode: EnvironmentTypes
) => {
  const appConfig: AppConfig = {
    port: process.env.PORT || 5000,
    environmentMode,
  };

  if (environmentMode === 'production') {
    const publicDir = path.join(__dirname, '../../public');
    appConfig.publicDir = publicDir;
  }

  return appConfig;
};
