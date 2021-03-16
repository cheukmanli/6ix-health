import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { CreateFormFillerUseCase } from 'domain/usecases/formFiller/createFormFiller/CreateFormFillerUseCase';
import {
  AlreadyExistsRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  createFormFillerUseCase: CreateFormFillerUseCase;
}

export class CreateFormFillerController extends BaseController {
  private usecase: CreateFormFillerUseCase;

  constructor({ createFormFillerUseCase }: Dependencies) {
    super();
    this.usecase = createFormFillerUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrFormFiller = await this.usecase.execute(req.body);

    errorOrFormFiller.caseOf({
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
