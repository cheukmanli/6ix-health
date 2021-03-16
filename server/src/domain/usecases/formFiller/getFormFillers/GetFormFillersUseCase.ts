import { UseCase } from 'domain/definition/UseCase';
import { FormFiller } from 'domain/entities/FormFiller';
import { Either, Left, Right } from 'purify-ts/Either';
import { ServerRequestError } from 'domain/usecases/errors';
import { IFormFillerEntityGateway } from '../IFormFillerEntityGateway';

type GetFormFillersResponseDTO = Either<ServerRequestError, FormFiller[]>;

interface Dependencies {
  formFillerEntityGateway: IFormFillerEntityGateway;
}

export class GetFormFillersUseCase
  implements UseCase<{}, GetFormFillersResponseDTO> {
  formFillerEntityGateway: IFormFillerEntityGateway;
  constructor({ formFillerEntityGateway }: Dependencies) {
    this.formFillerEntityGateway = formFillerEntityGateway;
  }

  async execute(): Promise<GetFormFillersResponseDTO> {
    try {
      const allFormFillers = await this.formFillerEntityGateway.getFormFillers();
      return Right(allFormFillers);
    } catch (error) {
      return Left(new ServerRequestError());
    }
  }
}
