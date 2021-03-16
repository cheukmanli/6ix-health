import BaseRouter from 'entrypoint/web/definitions/Router';
import { Router } from 'express';
import { CreateSDCFormResponseController } from '../controllers/SDCFormResponse/CreateSDCFormResponseController';
import { UpdateSDCFormResponseController } from '../controllers/SDCFormResponse/UpdateSDCFormResponseController';
import { GetSDCFormResponsesController } from '../controllers/SDCFormResponse/GetSDCFormResponsesController';
import { GetDefaultSDCFormResponseController } from '../controllers/SDCFormResponse/GetDefaultSDCFormResponseController';

interface Dependencies {
  createSDCFormResponseController: CreateSDCFormResponseController;
  getSDCFormResponsesController: GetSDCFormResponsesController;
  updateSDCFormResponseController: UpdateSDCFormResponseController;
  getDefaultSDCFormResponseController: GetDefaultSDCFormResponseController;
}

export class SDCFormResponseRouter implements BaseRouter {
  #createSDCFormResponseController: CreateSDCFormResponseController;
  #getSDCFormResponsesController: GetSDCFormResponsesController;
  #updateSDCFormResponseController: UpdateSDCFormResponseController;
  #getDefaultSDCFormResponseController: GetDefaultSDCFormResponseController;
  #router: Router;

  constructor({
    createSDCFormResponseController,
    getSDCFormResponsesController,
    updateSDCFormResponseController,
    getDefaultSDCFormResponseController,
  }: Dependencies) {
    this.#createSDCFormResponseController = createSDCFormResponseController;
    this.#getSDCFormResponsesController = getSDCFormResponsesController;
    this.#updateSDCFormResponseController = updateSDCFormResponseController;
    this.#getDefaultSDCFormResponseController = getDefaultSDCFormResponseController;
    this.#router = Router();
    this.configRouter();
  }

  private configRouter(): void {
    this.#router.post(
      '/api/v1/SDCFormResponse',
      this.#createSDCFormResponseController.getRequestHandler()
    );
    this.#router.get(
      '/api/v1/SDCFormResponse',
      this.#getSDCFormResponsesController.getRequestHandler()
    );
    this.#router.patch(
      '/api/v1/SDCFormResponse',
      this.#updateSDCFormResponseController.getRequestHandler()
    );
    this.#router.get(
      '/api/v1/SDCFormResponse/default',
      this.#getDefaultSDCFormResponseController.getRequestHandler()
    );
  }

  public getRouter(): Router {
    return this.#router;
  }
}
