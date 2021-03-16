import { UseCase } from 'domain/definition/UseCase';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IFormFillerEntityGateway } from '../IFormFillerEntityGateway';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

interface DeleteFormFillerRequestDTO {
  formFillerId: string;
}

type DeleteFormFillerResponseDTO = Maybe<
  NotFoundRequestError | ServerRequestError
>;

interface Dependencies {
  formFillerEntityGateway: IFormFillerEntityGateway;
}

export class DeleteFormFillerUseCase
  implements UseCase<DeleteFormFillerRequestDTO, DeleteFormFillerResponseDTO> {
  formFillerEntityGateway: IFormFillerEntityGateway;
  constructor({ formFillerEntityGateway }: Dependencies) {
    this.formFillerEntityGateway = formFillerEntityGateway;
  }

  async execute(
    request: DeleteFormFillerRequestDTO
  ): Promise<DeleteFormFillerResponseDTO> {
    try {
      await this.formFillerEntityGateway.deleteFormFiller(request.formFillerId);
    } catch (error) {
      if (error.message === 'not found') {
        return Just(new NotFoundRequestError());
      }

      return Just(new ServerRequestError());
    }
    return Nothing;
  }
}
