import { UseCase } from 'domain/definition/UseCase';
import { Right, Left, Either } from 'purify-ts/Either';
import { ISDCFormEntityGateway } from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { SDCForm } from 'domain/entities/SDCForm';
import { CreateSDCFormInvalidXMLStringRequest } from './CreateSDCFormErrors';
import { AlreadyExistsRequestError } from 'domain/usecases/errors';

interface CreateSDCFormRequestDTO {
  XMLString: string;
}

export type CreateSDCFormResponseDTO = Either<
  AlreadyExistsRequestError | CreateSDCFormInvalidXMLStringRequest,
  SDCForm
>;

interface Dependencies {
  SDCFormEntityGateway: ISDCFormEntityGateway;
}

export class CreateSDCFormUseCase
  implements UseCase<CreateSDCFormRequestDTO, CreateSDCFormResponseDTO> {
  private SDCFormEntityGateway: ISDCFormEntityGateway;

  constructor({ SDCFormEntityGateway }: Dependencies) {
    this.SDCFormEntityGateway = SDCFormEntityGateway;
  }

  async execute(
    request: CreateSDCFormRequestDTO
  ): Promise<CreateSDCFormResponseDTO> {
    try {
      const SDCForm = await this.SDCFormEntityGateway.createSDCForm(request);

      return Right(SDCForm);
    } catch (error) {
      if (error.message == 'SDCForm ID already exists') {
        return Left(new AlreadyExistsRequestError());
      } else {
        return Left(new CreateSDCFormInvalidXMLStringRequest());
      }
    }
  }
}
