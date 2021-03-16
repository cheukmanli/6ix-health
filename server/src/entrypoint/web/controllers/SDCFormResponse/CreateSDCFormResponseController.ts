import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  CreateSDCFormResponseResponseDTO,
  CreateSDCFormResponseUseCase,
} from 'domain/usecases/SDCFormResponse/createSDCFormResponse/CreateSDCFormResponseUseCase';
import {
  CreateSDCFormResponseInvalidRequest,
  CreateSDCFormResponseValidationFailedRequest,
} from 'domain/usecases/SDCFormResponse/createSDCFormResponse/CreateSDCFormResponseErrors';
import {
  AlreadyExistsRequestError,
  NotFoundRequestError,
} from 'domain/usecases/errors';

interface Dependencies {
  createSDCFormResponseUseCase: CreateSDCFormResponseUseCase;
}

export class CreateSDCFormResponseController extends BaseController {
  private usecase: CreateSDCFormResponseUseCase;

  constructor({ createSDCFormResponseUseCase }: Dependencies) {
    super();
    this.usecase = createSDCFormResponseUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrSDCFormResponse: CreateSDCFormResponseResponseDTO = await this.usecase.execute(
      req.body
    );

    errorOrSDCFormResponse.caseOf({
      Left: (error) => {
        if (error instanceof AlreadyExistsRequestError) {
          this.alreadyExists(res, error.message);
          return;
        } else if (error instanceof CreateSDCFormResponseInvalidRequest) {
          return this.badRequest(res, error.message);
        } else if (error instanceof NotFoundRequestError) {
          return this.notFound(res, error.message);
        } else if (
          error instanceof CreateSDCFormResponseValidationFailedRequest
        ) {
          return this.badRequest(
            res,
            JSON.stringify(error.failureOnQuestionResults)
          );
        }

        assertUnreachable(error);
      },
      Right: (SDCFormResponse) => this.ok(res, SDCFormResponse),
    });
  }
}
