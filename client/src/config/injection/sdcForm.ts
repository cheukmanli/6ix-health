import { AwilixContainer, asClass, asFunction } from 'awilix';
import { defaultInjectionOptions } from '.';
import { ISDCFormRepository } from '../../domain/sdcForm/SDCFormRepository';
import { ISDCFormService } from '../../domain/sdcForm/SDCFormService';
import { sdcFormDbCreator } from '../../infrastructure/sdcForm/sdcFormDb';
import { SDCFormDTO } from '../../infrastructure/sdcForm/SDCFormDto';
import { SDCFormRepositoryFake } from '../../infrastructure/sdcForm/SDCFormRepositoryFake';
import SDCFormRepositoryImpl from '../../infrastructure/sdcForm/SDCFormRepositoryImpl';
import SDCFormServiceImpl from '../../infrastructure/sdcForm/SDCFormServiceImpl';

export type SDCFormRegistrations = {
  sdcFormRepository: ISDCFormRepository;
  sdcFormService: ISDCFormService;
  sdcFormDb: PouchDB.Database<SDCFormDTO>;
};

export const SDCFormInjection = ({
  runPouchDbAsStandaloneServer,
} = defaultInjectionOptions) => ({
  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormRepository: asClass(SDCFormRepositoryFake).singleton(),
      sdcFormDb: asFunction(() =>
        sdcFormDbCreator(runPouchDbAsStandaloneServer)
      ).singleton(),
    });
  },

  registerProdAndDevCommonDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormRepository: asClass(SDCFormRepositoryImpl).singleton(),
    });
  },

  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      sdcFormService: asClass(SDCFormServiceImpl).singleton(),
    });
  },
});
