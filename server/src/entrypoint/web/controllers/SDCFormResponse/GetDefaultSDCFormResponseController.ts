import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  GetDefaultSDCFormResponseResponseDTO,
  GetDefaultSDCFormResponseUseCase,
} from 'domain/usecases/SDCFormResponse/getDefaultSDCFormResponse/GetDefaultSDCFormResponseUseCase';
import { UnknownRequestError } from 'domain/usecases/errors';
import { GetDefaultSDCFormResponseInvalidRequest } from 'domain/usecases/SDCFormResponse/getDefaultSDCFormResponse/GetDefaultSDCFormResponseErrors';

interface Dependencies {
  getDefaultSDCFormResponseUseCase: GetDefaultSDCFormResponseUseCase;
}

export class GetDefaultSDCFormResponseController extends BaseController {
  private usecase: GetDefaultSDCFormResponseUseCase;

  constructor({ getDefaultSDCFormResponseUseCase }: Dependencies) {
    super();
    this.usecase = getDefaultSDCFormResponseUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    let errorOrSDCFormResponse: GetDefaultSDCFormResponseResponseDTO;

    const { SDCFormId } = req.query;
    if (SDCFormId == undefined || typeof SDCFormId != 'string') {
      this.badRequest(res, 'SDCFormId must be a string');
    } else {
      const request = {
        SDCFormId,
      };

      errorOrSDCFormResponse = await this.usecase.execute(request);

      errorOrSDCFormResponse.caseOf({
        Left: (error) => {
          if (error instanceof UnknownRequestError) {
            return this.fail(res, error.message);
          } else if (error instanceof GetDefaultSDCFormResponseInvalidRequest) {
            return this.badRequest(res, error.message);
          }

          assertUnreachable(error);
        },
        Right: (DefaultSDCFormResponse) => this.ok(res, DefaultSDCFormResponse),
      });
    }
  }
}
