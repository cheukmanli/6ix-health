import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  DeleteSDCFormsUseCase,
  DeleteSDCFormsResponseDTO,
} from 'domain/usecases/SDCForm/deleteSDCForm/DeleteSDCFormsUseCase';
import { NotFoundRequestError } from 'domain/usecases/errors';

interface Dependencies {
  deleteSDCFormUseCase: DeleteSDCFormsUseCase;
}

export class DeleteSDCFormsController extends BaseController {
  private usecase: DeleteSDCFormsUseCase;

  constructor({ deleteSDCFormUseCase }: Dependencies) {
    super();
    this.usecase = deleteSDCFormUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const SDCFormsIds = req.body;
    const request = SDCFormsIds;

    const maybeError: DeleteSDCFormsResponseDTO = await this.usecase.execute(
      request
    );

    maybeError.caseOf({
      Just: (error) => {
        if (error instanceof NotFoundRequestError) {
          return this.notFound(res, error.message);
        }

        assertUnreachable(error);
      },
      Nothing: () => this.ok(res),
    });
  }
}
