import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { CreatePatientUseCase } from 'domain/usecases/patient/createPatient/CreatePatientUseCase';
import {
  AlreadyExistsRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  createPatientUseCase: CreatePatientUseCase;
}

export class CreatePatientController extends BaseController {
  private usecase: CreatePatientUseCase;

  constructor({ createPatientUseCase }: Dependencies) {
    super();
    this.usecase = createPatientUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrPatient = await this.usecase.execute(req.body);

    errorOrPatient.caseOf({
      Left: (error) => {
        if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        } else if (error instanceof AlreadyExistsRequestError) {
          return this.alreadyExists(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (patient) => this.ok(res, patient),
    });
  }
}
