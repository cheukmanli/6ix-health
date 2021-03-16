import { UseCase } from 'domain/definition/UseCase';
import { NotFoundRequestError } from 'domain/usecases/errors';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';
import { ISDCFormEntityGateway } from '../ISDCFormEntityGateway';

interface DeleteSDCFormsRequestDTO {
  SDCFormIds: string[];
}

export type DeleteSDCFormsResponseDTO = Maybe<NotFoundRequestError>;

interface Dependencies {
  SDCFormEntityGateway: ISDCFormEntityGateway;
}

export class DeleteSDCFormsUseCase
  implements UseCase<DeleteSDCFormsRequestDTO, DeleteSDCFormsResponseDTO> {
  private SDCFormEntityGateway: ISDCFormEntityGateway;

  constructor({ SDCFormEntityGateway }: Dependencies) {
    this.SDCFormEntityGateway = SDCFormEntityGateway;
  }

  async execute(
    request: DeleteSDCFormsRequestDTO
  ): Promise<DeleteSDCFormsResponseDTO> {
    try {
      await this.SDCFormEntityGateway.deleteSDCForms(request.SDCFormIds);
    } catch (error) {
      if (error.message === 'SDCForm Not Found') {
        return Just(new NotFoundRequestError());
      }
    }
    return Nothing;
  }
}
