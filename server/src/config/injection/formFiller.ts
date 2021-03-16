import { asClass, AwilixContainer } from 'awilix';
import { FormFillerMockEntityGateway } from 'data/formFiller/FormFillerMockEntityGateway';
import { FormFillerMongoEntityGateway } from 'data/formFiller/FormFillerMongoEntityGateway';
import { CreateFormFillerUseCase } from 'domain/usecases/formFiller/createFormFiller/CreateFormFillerUseCase';
import { DeleteFormFillerUseCase } from 'domain/usecases/formFiller/deleteFormFiller/DeleteFormFillerUseCase';
import { GetFormFillersUseCase } from 'domain/usecases/formFiller/getFormFillers/GetFormFillersUseCase';
import { IFormFillerEntityGateway } from 'domain/usecases/formFiller/IFormFillerEntityGateway';
import { UpdateFormFillerUseCase } from 'domain/usecases/formFiller/updateFormFiller/UpdateFormFillerUseCase';
import { CreateFormFillerController } from 'entrypoint/web/controllers/formFiller/CreateFormFillerController';
import { DeleteFormFillerController } from 'entrypoint/web/controllers/formFiller/DeleteFormFillerController';
import { GetFormFillersController } from 'entrypoint/web/controllers/formFiller/GetFormFillersController';
import { UpdateFormFillerController } from 'entrypoint/web/controllers/formFiller/UpdateFormFillerController';
import { FormFillerRouter } from 'entrypoint/web/routers/FormFillerRouter';

export type FormFillerRegistrations = {
  formFillerEntityGateway: IFormFillerEntityGateway;
  createFormFillerUseCase: CreateFormFillerUseCase;
  getFormFillersUseCase: GetFormFillersUseCase;
  updateFormFillerUseCase: UpdateFormFillerUseCase;
  deleteFormFillerUseCase: DeleteFormFillerUseCase;
  createFormFillerController: CreateFormFillerController;
  updateFormFillerController: UpdateFormFillerController;
  deleteFormFillerController: DeleteFormFillerController;
  getFormFillersController: GetFormFillersController;
  formFillerRouter: FormFillerRouter;
};

export const formFillerInjection = () => ({
  registerEnvironmentIndependentDependencies: (container: AwilixContainer) => {
    container.register({
      formFillerEntityGateway: asClass(
        FormFillerMongoEntityGateway
      ).singleton(),
      createFormFillerUseCase: asClass(CreateFormFillerUseCase).singleton(),
      getFormFillersUseCase: asClass(GetFormFillersUseCase).singleton(),
      updateFormFillerUseCase: asClass(UpdateFormFillerUseCase).singleton(),
      deleteFormFillerUseCase: asClass(DeleteFormFillerUseCase).singleton(),
      createFormFillerController: asClass(
        CreateFormFillerController
      ).singleton(),
      deleteFormFillerController: asClass(
        DeleteFormFillerController
      ).singleton(),
      updateFormFillerController: asClass(
        UpdateFormFillerController
      ).singleton(),
      getFormFillersController: asClass(GetFormFillersController).singleton(),
      formFillerRouter: asClass(FormFillerRouter).singleton(),
    });
  },
  registerTestDependencies: (container: AwilixContainer) => {
    container.register({
      formFillerEntityGateway: asClass(FormFillerMockEntityGateway).singleton(),
    });
  },
});
