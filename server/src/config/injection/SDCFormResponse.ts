import { asClass, AwilixContainer } from 'awilix';
import { CreateSDCFormResponseUseCase } from 'domain/usecases/SDCFormResponse/createSDCFormResponse/CreateSDCFormResponseUseCase';
import { UpdateSDCFormResponseUseCase } from 'domain/usecases/SDCFormResponse/updateSDCFormResponse/UpdateSDCFormResponseUseCase';
import { GetSDCFormResponsesUseCase } from 'domain/usecases/SDCFormResponse/getSDCFormResponses/GetSDCFormResponsesUseCase';
import { GetDefaultSDCFormResponseUseCase } from 'domain/usecases/SDCFormResponse/getDefaultSDCFormResponse/GetDefaultSDCFormResponseUseCase';
import { ISDCFormEntityGateway } from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { ISDCFormResponseEntityGateway } from 'domain/usecases/SDCFormResponse/ISDCFormResponseEntityGateway';
import { SDCFormInMemoryEntityGateway } from 'data/SDCForm/SDCFormInMemoryEntityGateway';
import { SDCFormResponseInMemoryEntityGateway } from 'data/SDCFormResponse/SDCFormResponseInMemoryEntityGateway';
import { SDCFormMockEntityGateway } from 'data/SDCForm/SDCFormMockEntityGateway';
import { CreateSDCFormResponseController } from 'entrypoint/web/controllers/SDCFormResponse/CreateSDCFormResponseController';
import { UpdateSDCFormResponseController } from 'entrypoint/web/controllers/SDCFormResponse/UpdateSDCFormResponseController';
import { GetSDCFormResponsesController } from 'entrypoint/web/controllers/SDCFormResponse/GetSDCFormResponsesController';
import { GetDefaultSDCFormResponseController } from 'entrypoint/web/controllers/SDCFormResponse/GetDefaultSDCFormResponseController';
import { SDCFormResponseRouter } from 'entrypoint/web/routers/SDCFormResponseRouter';
import { ValidateSDCFormResponseUseCase } from 'domain/usecases/SDCFormResponse/validateSDCFormResponse';

export type SDCFormResponseRegistrations = {
  SDCFormEntityGateway: ISDCFormEntityGateway;
  SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;
  getSDCFormResponsesUseCase: GetSDCFormResponsesUseCase;
  createSDCFormResponseUseCase: CreateSDCFormResponseUseCase;
  updateSDCFormResponseUseCase: UpdateSDCFormResponseUseCase;
  getDefaultSDCFormResponseUseCase: GetDefaultSDCFormResponseUseCase;
  getSDCFormResponsesController: GetSDCFormResponsesController;
  validateSDCFormResponseUseCase: ValidateSDCFormResponseUseCase;
  createSDCFormResponseController: CreateSDCFormResponseController;
  updateSDCFormResponseController: UpdateSDCFormResponseController;
  getDefaultSDCFormResponseController: GetDefaultSDCFormResponseController;
  SDCFormResponseRouter: SDCFormResponseRouter;
};

export const SDCFormResponseInjection = () => ({
  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      SDCFormEntityGateway: asClass(SDCFormInMemoryEntityGateway).singleton(),
      SDCFormResponseEntityGateway: asClass(
        SDCFormResponseInMemoryEntityGateway
      ).singleton(),
      getSDCFormResponsesUseCase: asClass(
        GetSDCFormResponsesUseCase
      ).singleton(),
      createSDCFormResponseUseCase: asClass(
        CreateSDCFormResponseUseCase
      ).singleton(),
      updateSDCFormResponseUseCase: asClass(
        UpdateSDCFormResponseUseCase
      ).singleton(),
      getDefaultSDCFormResponseUseCase: asClass(
        GetDefaultSDCFormResponseUseCase
      ).singleton(),
      getSDCFormResponsesController: asClass(
        GetSDCFormResponsesController
      ).singleton(),
      validateSDCFormResponseUseCase: asClass(
        ValidateSDCFormResponseUseCase
      ).singleton(),
      createSDCFormResponseController: asClass(
        CreateSDCFormResponseController
      ).singleton(),
      updateSDCFormResponseController: asClass(
        UpdateSDCFormResponseController
      ).singleton(),
      getDefaultSDCFormResponseController: asClass(
        GetDefaultSDCFormResponseController
      ).singleton(),
      SDCFormResponseRouter: asClass(SDCFormResponseRouter).singleton(),
    });
  },

  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      SDCFormEntityGateway: asClass(SDCFormMockEntityGateway).singleton(),
    });
  },
});
