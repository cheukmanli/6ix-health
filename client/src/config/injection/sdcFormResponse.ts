import { AwilixContainer, asClass } from 'awilix';
import { ISDCFormResponseRepository } from '../../domain/sdcFormResponse/SDCFormResponseRepository';
import { ISDCFormResponseService } from '../../domain/sdcFormResponse/SDCFormResponseService';
import { SDCFormResponseRepositoryFake } from '../../infrastructure/sdcFormResponse/SDCFormResponseRepositoryFake';
import SDCFormResponseRepositoryImpl from '../../infrastructure/sdcFormResponse/SDCFormResponseRepositoryImpl';
import SDCFormResponseServiceImpl from '../../infrastructure/sdcFormResponse/SDCFormResponseServiceImpl';

export type SDCFormResponseRegistrations = {
  sdcFormResponseRepository: ISDCFormResponseRepository;
  sdcFormResponseService: ISDCFormResponseService;
};

export const SDCFormResponseInjection = () => ({
  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormResponseRepository: asClass(
        SDCFormResponseRepositoryFake
      ).singleton(),
    });
  },

  registerProdAndDevCommonDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormResponseRepository: asClass(
        SDCFormResponseRepositoryImpl
      ).singleton(),
    });
  },

  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormResponseService: asClass(SDCFormResponseServiceImpl).singleton(),
    });
  },
});
