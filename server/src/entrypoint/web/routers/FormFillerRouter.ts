import { Router } from 'express';
import { CreateFormFillerController } from '../controllers/formFiller/CreateFormFillerController';
import { DeleteFormFillerController } from '../controllers/formFiller/DeleteFormFillerController';
import { GetFormFillersController } from '../controllers/formFiller/GetFormFillersController';
import { UpdateFormFillerController } from '../controllers/formFiller/UpdateFormFillerController';
import BaseRouter from '../definitions/Router';

interface Dependencies {
  createFormFillerController: CreateFormFillerController;
  getFormFillersController: GetFormFillersController;
  updateFormFillerController: UpdateFormFillerController;
  deleteFormFillerController: DeleteFormFillerController;
}

export class FormFillerRouter implements BaseRouter {
  #createFormFillerControler: CreateFormFillerController;
  #getFormFillersController: GetFormFillersController;
  #updateFormFillerController: UpdateFormFillerController;
  #deleteFormFillerController: DeleteFormFillerController;
  #router: Router;

  constructor({
    createFormFillerController,
    getFormFillersController,
    updateFormFillerController,
    deleteFormFillerController,
  }: Dependencies) {
    this.#createFormFillerControler = createFormFillerController;
    this.#getFormFillersController = getFormFillersController;
    this.#updateFormFillerController = updateFormFillerController;
    this.#deleteFormFillerController = deleteFormFillerController;
    this.#router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    this.#router.post(
      '/api/v1/form-filler',
      this.#createFormFillerControler.getRequestHandler()
    );

    this.#router.get(
      '/api/v1/form-filler',
      this.#getFormFillersController.getRequestHandler()
    );

    this.#router.put(
      '/api/v1/form-filler',
      this.#updateFormFillerController.getRequestHandler()
    );

    this.#router.delete(
      '/api/v1/form-filler',
      this.#deleteFormFillerController.getRequestHandler()
    );
  }

  public getRouter(): Router {
    return this.#router;
  }
}
