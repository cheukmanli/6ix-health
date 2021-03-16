import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import { UpdateFormFillerUseCase } from 'domain/usecases/formFiller/updateFormFiller/UpdateFormFillerUseCase';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  updateFormFillerUseCase: UpdateFormFillerUseCase;
}

export class UpdateFormFillerController extends BaseController {
  private usecase: UpdateFormFillerUseCase;

  constructor({ updateFormFillerUseCase }: Dependencies) {
    super();
    this.usecase = updateFormFillerUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrUpdatedFormFiller = await this.usecase.execute(req.body);

    errorOrUpdatedFormFiller.caseOf({
      Left: (error) => {
        if (error instanceof NotFoundRequestError) {
          return this.notFound(res, error.message);
        } else if (error instanceof ServerRequestError) {
          return this.fail(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (updatedFormFiller) => this.ok(res, updatedFormFiller),
    });
  }
}
