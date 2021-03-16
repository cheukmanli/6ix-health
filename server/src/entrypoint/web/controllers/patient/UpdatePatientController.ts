import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { UpdatePatientUseCase } from 'domain/usecases/patient/updatePatient/UpdatePatientUseCase';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  updatePatientUseCase: UpdatePatientUseCase;
}

export class UpdatePatientController extends BaseController {
  private usecase: UpdatePatientUseCase;

  constructor({ updatePatientUseCase }: Dependencies) {
    super();
    this.usecase = updatePatientUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrUpdatedPatient = await this.usecase.execute(req.body);

    errorOrUpdatedPatient.caseOf({
      Left: (error) => {
        if (error instanceof NotFoundRequestError) {
          return this.notFound(res, error.message);
        } else if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (updatedPatient) => this.ok(res, updatedPatient),
    });
  }
}
