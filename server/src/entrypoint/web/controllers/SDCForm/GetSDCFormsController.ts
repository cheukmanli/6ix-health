import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  GetSDCFormsUseCase,
  GetSDCFormsResponseDTO,
} from 'domain/usecases/SDCForm/getSDCForms/GetSDCFormsUseCase';
import { UnknownRequestError } from 'domain/usecases/errors';

interface Dependencies {
  getSDCFormsUseCase: GetSDCFormsUseCase;
}

export class GetSDCFormsController extends BaseController {
  private usecase: GetSDCFormsUseCase;

  constructor({ getSDCFormsUseCase }: Dependencies) {
    super();
    this.usecase = getSDCFormsUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    let errorOrSDCForm: GetSDCFormsResponseDTO;

    const { SDCFormIds, diagnosticProcedureIds, query } = req.query;
    if (SDCFormIds != undefined && typeof SDCFormIds != 'string') {
      this.badRequest(res, 'SDCFormIds must be a string');
    } else if (
      diagnosticProcedureIds != undefined &&
      typeof diagnosticProcedureIds != 'string'
    ) {
      this.badRequest(res, 'diagnosticProcedureIds must be a string');
    } else if (query != undefined && typeof query != 'string') {
      this.badRequest(res, 'query must be a string');
    } else {
      const request = {
        SDCFormId: SDCFormIds?.split(','),
        diagnosticProcedureId: diagnosticProcedureIds?.split(','),
        query,
      };

      errorOrSDCForm = await this.usecase.execute(request);

      errorOrSDCForm.caseOf({
        Left: (error) => {
          if (error instanceof UnknownRequestError) {
            return this.fail(res, error.message);
          }

          assertUnreachable(error);
        },
        Right: (sdcFormList) => this.ok(res, sdcFormList),
      });
    }
  }
}
