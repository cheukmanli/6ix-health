import { asValue, AwilixContainer } from 'awilix';
import { EnvironmentTypes } from '.';

export type GeneralRegistrations = {
  environmentMode: EnvironmentTypes;
};

export const generalInjection = () => ({
  registerProdDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('production'),
    });
  },

  registerDevDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('development'),
    });
  },

  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      environmentMode: asValue('test'),
    });
  },
});
