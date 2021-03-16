import { UseCase } from 'domain/definition/UseCase';
import { FormFiller } from 'domain/entities/FormFiller';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  AlreadyExistsRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IFormFillerEntityGateway } from '../IFormFillerEntityGateway';

interface CreateFormFillerRequestDTO {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

type CreateFormFillerResponseDTO = Either<
  AlreadyExistsRequestError | ServerRequestError,
  FormFiller
>;

interface Dependencies {
  formFillerEntityGateway: IFormFillerEntityGateway;
}

export class CreateFormFillerUseCase
  implements UseCase<CreateFormFillerRequestDTO, CreateFormFillerResponseDTO> {
  formFillerEntityGateway: IFormFillerEntityGateway;
  constructor({ formFillerEntityGateway }: Dependencies) {
    this.formFillerEntityGateway = formFillerEntityGateway;
  }

  async execute(
    request: CreateFormFillerRequestDTO
  ): Promise<CreateFormFillerResponseDTO> {
    try {
      const createdFormFiller = await this.formFillerEntityGateway.createFormFiller(
        request
      );
      return Right(createdFormFiller);
    } catch (error) {
      if (error.message == 'already exists') {
        return Left(new AlreadyExistsRequestError());
      }
      return Left(new ServerRequestError());
    }
  }
}
