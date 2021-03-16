import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import { AppConfig, appConfigCreatingFunction } from 'config/AppConfig';
import { ExpressApp } from 'entrypoint/web/ExpressApp';
import { EnvironmentTypes } from '.';

export type GeneralRegistrations = {
  expressApp: ExpressApp;
  config: AppConfig;
  environmentMode: EnvironmentTypes;
  mongoBaseURL: string;
};

export const generalInjection = () => ({
  registerProdDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('production'),
      mongoBaseURL: asValue(
        'mongodb+srv://admin:csc302p2@ourcluster.dherv.mongodb.net'
      ),
    });
  },

  registerDevDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('development'),
      mongoBaseURL: asValue('mongodb://localhost:27017'),
    });
  },

  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('test'),
    });
  },

  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      config: asFunction(() =>
        appConfigCreatingFunction(container.cradle.environmentMode)
      ).singleton(),
      expressApp: asClass(ExpressApp).singleton(),
    });
  },
});
