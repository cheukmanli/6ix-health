import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { ServerRequestError } from 'domain/usecases/errors';
import { GetPatientsUseCase } from 'domain/usecases/patient/getPatients/GetPatientsUseCase';

interface Dependencies {
  getPatientsUseCase: GetPatientsUseCase;
}

export class GetPatientsController extends BaseController {
  private usecase: GetPatientsUseCase;

  constructor({ getPatientsUseCase }: Dependencies) {
    super();
    this.usecase = getPatientsUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrPatient = await this.usecase.execute();

    errorOrPatient.caseOf({
      Left: (error) => {
        if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (patients) => this.ok(res, patients),
    });
  }
}
