import { asClass, asFunction, AwilixContainer } from 'awilix';
import { defaultInjectionOptions } from '.';
import { IFormFillerRepository } from '../../domain/formFiller/FormFillerRepository';
import { IFormFillerService } from '../../domain/formFiller/FormFillerService';
import { FormFillerDTO } from '../../infrastructure/formFiller/FormFillerDto';
import { FormFillerRepositoryFake } from '../../infrastructure/formFiller/FormFillerRepositoryFake';
import FormFillerRepositoryImpl from '../../infrastructure/formFiller/FormFillerRepositoryImpl';
import FormFillerServiceImpl from '../../infrastructure/formFiller/FormFIllerServiceImpl';
import { formFillerDbCreator } from '../../infrastructure/formFiller/FormFillerDb';

export type FormFillerRegistrations = {
  formFillerRepository: IFormFillerRepository;
  formFillerService: IFormFillerService;
  formFillerDb: PouchDB.Database<FormFillerDTO>;
};

export const formFillerInjection = ({
  runPouchDbAsStandaloneServer,
} = defaultInjectionOptions) => ({
  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      formFillerRepository: asClass(FormFillerRepositoryFake).singleton(),
      formFillerDb: asFunction(() =>
        formFillerDbCreator(runPouchDbAsStandaloneServer)
      ).singleton(),
    });
  },

  registerProdAndDevCommonDependencies: (container: AwilixContainer) => {
    container.register({
      formFillerRepository: asClass(FormFillerRepositoryImpl).singleton(),
    });
  },

  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      formFillerService: asClass(FormFillerServiceImpl).singleton(),
    });
  },
});
