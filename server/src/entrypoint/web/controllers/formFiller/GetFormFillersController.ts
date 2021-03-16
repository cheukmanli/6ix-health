import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { ServerRequestError } from 'domain/usecases/errors';
import { GetFormFillersUseCase } from 'domain/usecases/formFiller/getFormFillers/GetFormFillersUseCase';

interface Dependencies {
  getFormFillersUseCase: GetFormFillersUseCase;
}

export class GetFormFillersController extends BaseController {
  private usecase: GetFormFillersUseCase;

  constructor({ getFormFillersUseCase }: Dependencies) {
    super();
    this.usecase = getFormFillersUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrFormFiller = await this.usecase.execute();

    errorOrFormFiller.caseOf({
      Left: (error) => {
        if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (formFillers) => this.ok(res, formFillers),
    });
  }
}
