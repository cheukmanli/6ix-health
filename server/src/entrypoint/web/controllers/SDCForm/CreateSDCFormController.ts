import { Response } from 'express';
import BaseController from 'entrypoint/web/definitions/Controller';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';
import { assertUnreachable } from 'domain/helpers';
import {
  CreateSDCFormResponseDTO,
  CreateSDCFormUseCase,
} from 'domain/usecases/SDCForm/createSDCForm/CreateSDCFormUseCase';
import { CreateSDCFormInvalidXMLStringRequest } from 'domain/usecases/SDCForm/createSDCForm/CreateSDCFormErrors';
import { AlreadyExistsRequestError } from 'domain/usecases/errors';

interface Dependencies {
  createSDCFormUseCase: CreateSDCFormUseCase;
}

export class CreateSDCFormController extends BaseController {
  private usecase: CreateSDCFormUseCase;

  constructor({ createSDCFormUseCase }: Dependencies) {
    super();
    this.usecase = createSDCFormUseCase;
  }

  protected async processRequest(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<void> {
    const errorOrSDCForm: CreateSDCFormResponseDTO = await this.usecase.execute(
      req.body
    );

    errorOrSDCForm.caseOf({
      Left: (error) => {
        if (error instanceof AlreadyExistsRequestError) {
          this.alreadyExists(res, error.message);
          return;
        } else if (error instanceof CreateSDCFormInvalidXMLStringRequest) {
          return this.badRequest(res, error.message);
        }

        assertUnreachable(error);
      },
      Right: (SDCForm) => this.ok(res, SDCForm),
    });
  }
}
