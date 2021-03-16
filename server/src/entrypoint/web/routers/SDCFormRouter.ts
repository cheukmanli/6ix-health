import BaseRouter from 'entrypoint/web/definitions/Router';
import { Router } from 'express';
import { CreateSDCFormController } from '../controllers/SDCForm/CreateSDCFormController';
import { DeleteSDCFormsController } from '../controllers/SDCForm/DeleteSDCFormsController';
import { GetSDCFormsController } from '../controllers/SDCForm/GetSDCFormsController';

interface Dependencies {
  createSDCFormController: CreateSDCFormController;
  getSDCFormsController: GetSDCFormsController;
  deleteSDCFormsController: DeleteSDCFormsController;
}

export class SDCFormRouter implements BaseRouter {
  #createSDCFormController: CreateSDCFormController;
  #getSDCFormsController: GetSDCFormsController;
  #deleteSDCFormsController: DeleteSDCFormsController;
  #router: Router;

  constructor({
    createSDCFormController,
    getSDCFormsController,
    deleteSDCFormsController,
  }: Dependencies) {
    this.#createSDCFormController = createSDCFormController;
    this.#getSDCFormsController = getSDCFormsController;
    this.#deleteSDCFormsController = deleteSDCFormsController;
    this.#router = Router();
    this.configRouter();
  }

  private configRouter(): void {
    this.#router.post(
      '/api/v1/SDCForm',
      this.#createSDCFormController.getRequestHandler()
    );
    this.#router.get(
      '/api/v1/SDCForm',
      this.#getSDCFormsController.getRequestHandler()
    );
    this.#router.delete(
      '/api/v1/SDCForm',
      this.#deleteSDCFormsController.getRequestHandler()
    );
  }

  public getRouter(): Router {
    return this.#router;
  }
}
