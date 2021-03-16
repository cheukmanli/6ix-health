import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  GetSDCFormResponsesResponseDTO,
  GetSDCFormResponsesUseCase,
} from 'domain/usecases/SDCFormResponse/getSDCFormResponses/GetSDCFormResponsesUseCase';
import { GetSDCFormResponsesInvalidRequest } from 'domain/usecases/SDCFormResponse/getSDCFormResponses/GetSDCFormResponsesErrors';
import { NotFoundRequestError } from 'domain/usecases/errors';

interface Dependencies {
  getSDCFormResponsesUseCase: GetSDCFormResponsesUseCase;
}

export class GetSDCFormResponsesController extends BaseController {
  private usecase: GetSDCFormResponsesUseCase;

  constructor({ getSDCFormResponsesUseCase }: Dependencies) {
    super();
    this.usecase = getSDCFormResponsesUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    let errorOrSDCFormResponse: GetSDCFormResponsesResponseDTO;

    const { SDCFormId, diagnosticProcedureId } = req.query;
    if (SDCFormId != undefined && typeof SDCFormId != 'string') {
      this.badRequest(res, 'SDCFormId must be a string');
    } else if (
      diagnosticProcedureId != undefined &&
      typeof diagnosticProcedureId != 'string'
    ) {
      this.badRequest(res, 'diagnosticProcedureId must be a string');
    } else {
      const request = {
        SDCFormId,
        diagnosticProcedureId,
      };

      errorOrSDCFormResponse = await this.usecase.execute(request);

      errorOrSDCFormResponse.caseOf({
        Left: (error) => {
          if (error instanceof NotFoundRequestError) {
            return this.fail(res, error.message);
          } else if (error instanceof GetSDCFormResponsesInvalidRequest) {
            return this.badRequest(res, error.message);
          }

          assertUnreachable(error);
        },
        Right: (SDCFormResponseList) => this.ok(res, SDCFormResponseList),
      });
    }
  }
}
