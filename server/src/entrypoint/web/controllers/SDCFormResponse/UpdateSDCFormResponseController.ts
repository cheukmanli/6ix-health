import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  UpdateSDCFormResponseResponsesDTO,
  UpdateSDCFormResponseUseCase,
} from 'domain/usecases/SDCFormResponse/updateSDCFormResponse/UpdateSDCFormResponseUseCase';
import { UpdateSDCFormResponseInvalidRequest } from 'domain/usecases/SDCFormResponse/updateSDCFormResponse/UpdateSDCFormResponseErrors';
import { UnknownRequestError } from 'domain/usecases/errors';

interface Dependencies {
  updateSDCFormResponseUseCase: UpdateSDCFormResponseUseCase;
}

export class UpdateSDCFormResponseController extends BaseController {
  private usecase: UpdateSDCFormResponseUseCase;

  constructor({ updateSDCFormResponseUseCase }: Dependencies) {
    super();
    this.usecase = updateSDCFormResponseUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const { SDCFormResponse } = req.body;
    const request = {
      SDCFormResponse,
    };

    const errorOrSDCFormResponse: UpdateSDCFormResponseResponsesDTO = await this.usecase.execute(
      request
    );

    errorOrSDCFormResponse.caseOf({
      Left: (error) => {
        if (error instanceof UnknownRequestError) {
          return this.fail(res, error.message);
        } else if (error instanceof UpdateSDCFormResponseInvalidRequest) {
          return this.badRequest(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (SDCFormResponseList) => this.ok(res, SDCFormResponseList),
    });
  }
}
