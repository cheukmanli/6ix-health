import { asClass, AwilixContainer } from 'awilix';
import { CreateSDCFormUseCase } from 'domain/usecases/SDCForm/createSDCForm/CreateSDCFormUseCase';
import { DeleteSDCFormsUseCase } from 'domain/usecases/SDCForm/deleteSDCForm/DeleteSDCFormsUseCase';
import { GetSDCFormsUseCase } from 'domain/usecases/SDCForm/getSDCForms/GetSDCFormsUseCase';
import { ISDCFormEntityGateway } from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { SDCFormInMemoryEntityGateway } from 'data/SDCForm/SDCFormInMemoryEntityGateway';
import { SDCFormMockEntityGateway } from 'data/SDCForm/SDCFormMockEntityGateway';
import { CreateSDCFormController } from 'entrypoint/web/controllers/SDCForm/CreateSDCFormController';
import { DeleteSDCFormsController } from 'entrypoint/web/controllers/SDCForm/DeleteSDCFormsController';
import { GetSDCFormsController } from 'entrypoint/web/controllers/SDCForm/GetSDCFormsController';
import { SDCFormRouter } from 'entrypoint/web/routers/SDCFormRouter';

export type SDCFormRegistrations = {
  SDCFormEntityGateway: ISDCFormEntityGateway;
  getSDCFormsUseCase: GetSDCFormsUseCase;
  createSDCFormUseCase: CreateSDCFormUseCase;
  deleteSDCFormUseCase: DeleteSDCFormsUseCase;
  getSDCFormsController: GetSDCFormsController;
  createSDCFormController: CreateSDCFormController;
  deleteSDCFormsController: DeleteSDCFormsController;
  SDCFormRouter: SDCFormRouter;
};

export const SDCFormInjection = () => ({
  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      SDCFormEntityGateway: asClass(SDCFormInMemoryEntityGateway).singleton(),
      getSDCFormsUseCase: asClass(GetSDCFormsUseCase).singleton(),
      createSDCFormUseCase: asClass(CreateSDCFormUseCase).singleton(),
      deleteSDCFormUseCase: asClass(DeleteSDCFormsUseCase).singleton(),
      getSDCFormsController: asClass(GetSDCFormsController).singleton(),
      createSDCFormController: asClass(CreateSDCFormController).singleton(),
      deleteSDCFormsController: asClass(DeleteSDCFormsController).singleton(),
      SDCFormRouter: asClass(SDCFormRouter).singleton(),
    });
  },

  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      SDCFormEntityGateway: asClass(SDCFormMockEntityGateway).singleton(),
    });
  },
});
