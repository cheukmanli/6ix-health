import { UseCase } from 'domain/definition/UseCase';
import { Right, Left, Either } from 'purify-ts/Either';
import {
  CreateSDCFormResponsePayload,
  ISDCFormResponseEntityGateway,
} from 'domain/usecases/SDCFormResponse/ISDCFormResponseEntityGateway';
import { SDCFormResponse } from 'domain/entities/SDCFormResponse';
import {
  CreateSDCFormResponseInvalidRequest,
  CreateSDCFormResponseValidationFailedRequest,
} from './CreateSDCFormResponseErrors';
import {
  NotFoundRequestError,
  UnknownRequestError,
} from 'domain/usecases/errors';
import { ISDCFormEntityGateway } from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { ValidateSDCFormResponseUseCase } from '../validateSDCFormResponse';
import { assertUnreachable } from 'domain/helpers';

// Change back interface if need arises
type CreateSDCFormResponseRequestDTO = CreateSDCFormResponsePayload;

export type CreateSDCFormResponseResponseDTO = Either<
  | CreateSDCFormResponseInvalidRequest
  | NotFoundRequestError
  | CreateSDCFormResponseValidationFailedRequest,
  SDCFormResponse
>;

interface Dependencies {
  SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;
  SDCFormEntityGateway: ISDCFormEntityGateway;
  validateSDCFormResponseUseCase: ValidateSDCFormResponseUseCase;
}

export class CreateSDCFormResponseUseCase
  implements
    UseCase<CreateSDCFormResponseRequestDTO, CreateSDCFormResponseResponseDTO> {
  private SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;
  private SDCFormEntityGateway: ISDCFormEntityGateway;
  private validateSDCFormResponseUseCase: ValidateSDCFormResponseUseCase;

  constructor({
    SDCFormResponseEntityGateway,
    SDCFormEntityGateway,
    validateSDCFormResponseUseCase,
  }: Dependencies) {
    this.SDCFormResponseEntityGateway = SDCFormResponseEntityGateway;
    this.SDCFormEntityGateway = SDCFormEntityGateway;
    this.validateSDCFormResponseUseCase = validateSDCFormResponseUseCase;
  }

  async execute(
    request: CreateSDCFormResponseRequestDTO
  ): Promise<CreateSDCFormResponseResponseDTO> {
    let SDCFormRelatingToFormResponse;
    let formResponseValidationResult;

    try {
      SDCFormRelatingToFormResponse = await this.SDCFormEntityGateway.getSDCForm(
        request.SDCFormId
      );
      if (!SDCFormRelatingToFormResponse) {
        return Left(new NotFoundRequestError());
      }
    } catch (error) {
      return Left(new UnknownRequestError());
    }
    try {
      formResponseValidationResult = await this.validateSDCFormResponseUseCase.execute(
        { sdcForm: SDCFormRelatingToFormResponse, sdcFormResponse: request }
      );
    } catch (error) {
      return Left(new UnknownRequestError());
    }

    ////////////////////////////////////////////////////////////////////////

    if (formResponseValidationResult.isLeft()) {
      const error = formResponseValidationResult.extract();

      if (error instanceof UnknownRequestError) {
        return Left(new UnknownRequestError());
      }

      assertUnreachable(error);
    }

    if (formResponseValidationResult.isRight()) {
      const validationResult = formResponseValidationResult.extract();
      if (validationResult.status === 'FAILURE_ON_MATCHING_FORM_WITH_RES') {
        return Left(new CreateSDCFormResponseInvalidRequest());
      } else if (validationResult.status === 'FAILED_QUESTIONS') {
        return Left(
          new CreateSDCFormResponseValidationFailedRequest(validationResult)
        );
        // OK
      } else {
        try {
          const SDCFormResponse = await this.SDCFormResponseEntityGateway.createSDCFormResponse(
            request
          );

          return Right(SDCFormResponse);
        } catch (error) {
          return Left(new CreateSDCFormResponseInvalidRequest());
        }
      }
    }

    // to satisfy ESLint
    return Left(new CreateSDCFormResponseInvalidRequest());
  }
}
