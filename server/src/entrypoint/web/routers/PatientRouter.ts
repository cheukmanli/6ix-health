import { Router } from 'express';
import { CreatePatientController } from '../controllers/patient/CreatePatientController';
import { DeletePatientController } from '../controllers/patient/DeletePatientController';
import { GetPatientsController } from '../controllers/patient/GetPatientsController';
import { UpdatePatientController } from '../controllers/patient/UpdatePatientController';
import BaseRouter from '../definitions/Router';

interface Dependencies {
  createPatientController: CreatePatientController;
  getPatientsController: GetPatientsController;
  updatePatientController: UpdatePatientController;
  deletePatientController: DeletePatientController;
}

export class PatientRouter implements BaseRouter {
  #createPatientControler: CreatePatientController;
  #getPatientsController: GetPatientsController;
  #updatePatientController: UpdatePatientController;
  #deletePatientController: DeletePatientController;
  #router: Router;

  constructor({
    createPatientController,
    getPatientsController,
    updatePatientController,
    deletePatientController,
  }: Dependencies) {
    this.#createPatientControler = createPatientController;
    this.#getPatientsController = getPatientsController;
    this.#updatePatientController = updatePatientController;
    this.#deletePatientController = deletePatientController;
    this.#router = Router();
    this.configureRouter();
  }

  private configureRouter(): void {
    this.#router.post(
      '/api/v1/patient',
      this.#createPatientControler.getRequestHandler()
    );

    this.#router.get(
      '/api/v1/patient',
      this.#getPatientsController.getRequestHandler()
    );

    this.#router.put(
      '/api/v1/patient',
      this.#updatePatientController.getRequestHandler()
    );

    this.#router.delete(
      '/api/v1/patient',
      this.#deletePatientController.getRequestHandler()
    );
  }

  public getRouter(): Router {
    return this.#router;
  }
}
