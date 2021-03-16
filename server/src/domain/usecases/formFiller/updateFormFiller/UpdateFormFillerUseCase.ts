import { UseCase } from 'domain/definition/UseCase';
import { FormFiller } from 'domain/entities/FormFiller';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IFormFillerEntityGateway } from '../IFormFillerEntityGateway';

interface UpdateFormFillerRequestDTO {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

type UpdateFormFillerResponseDTO = Either<
  NotFoundRequestError | ServerRequestError,
  FormFiller
>;

interface Dependencies {
  formFillerEntityGateway: IFormFillerEntityGateway;
}

export class UpdateFormFillerUseCase
  implements UseCase<UpdateFormFillerRequestDTO, UpdateFormFillerResponseDTO> {
  formFillerEntityGateway: IFormFillerEntityGateway;
  constructor({ formFillerEntityGateway }: Dependencies) {
    this.formFillerEntityGateway = formFillerEntityGateway;
  }

  async execute(
    request: UpdateFormFillerRequestDTO
  ): Promise<UpdateFormFillerResponseDTO> {
    try {
      const UpdatedFormFiller = await this.formFillerEntityGateway.updateFormFiller(
        request
      );
      return Right(UpdatedFormFiller);
    } catch (error) {
      if (error.message == 'not found') {
        return Left(new NotFoundRequestError());
      }
      return Left(new ServerRequestError());
    }
  }
}
