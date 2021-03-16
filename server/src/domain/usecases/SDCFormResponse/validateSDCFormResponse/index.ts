import { UseCase } from '../../../../domain/definition/UseCase';
import { UnknownRequestError } from '../../../../domain/usecases/errors';
import { Either, Right, Left } from 'purify-ts/Either';
import SDCForm from '../../../../domain/entities/SDCForm';
import SDCFormResponse from '../../../../domain/entities/SDCFormResponse';
import SDCFormResponseValidationResult from '../../../../domain/entities/SDCFormResponseValidationResult';
import { SDCFormResponseValidatorUtility } from './formValidation';

type ValidateSDCFormResponseUseCaseDTO = {
  sdcFormResponse: Omit<
    SDCFormResponse,
    'formFillerId' | 'OHIPNumber' | 'lastModified'
  >;
  sdcForm: SDCForm;
};

export type ValidateSDCFormResponseUseCaseResponseDTO = Either<
  UnknownRequestError,
  SDCFormResponseValidationResult
>;

export class ValidateSDCFormResponseUseCase
  implements
    UseCase<
      ValidateSDCFormResponseUseCaseDTO,
      ValidateSDCFormResponseUseCaseResponseDTO
    > {
  async execute(
    request: ValidateSDCFormResponseUseCaseDTO
  ): Promise<ValidateSDCFormResponseUseCaseResponseDTO> {
    const { sdcForm, sdcFormResponse } = request;

    try {
      const validation = await new Promise<SDCFormResponseValidationResult>(
        (res) => {
          const validation = SDCFormResponseValidatorUtility.validateSDCFormResponse(
            sdcFormResponse,
            sdcForm
          );

          res(validation);
        }
      );

      return Right(validation);
    } catch (error) {
      return Left(new UnknownRequestError());
    }
  }
}
