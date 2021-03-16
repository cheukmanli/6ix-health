import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { DeletePatientUseCase } from 'domain/usecases/patient/deletePatient/DeletePatientUseCase';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  deletePatientUseCase: DeletePatientUseCase;
}

export class DeletePatientController extends BaseController {
  private usecase: DeletePatientUseCase;

  constructor({ deletePatientUseCase }: Dependencies) {
    super();
    this.usecase = deletePatientUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const maybeError = await this.usecase.execute(req.body);

    maybeError.caseOf({
      Just: (error) => {
        if (error instanceof NotFoundRequestError) {
          return this.notFound(res, error.message);
        } else if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        }

        assertUnreachable(error);
      },
      Nothing: () => this.ok(res),
    });
  }
}
