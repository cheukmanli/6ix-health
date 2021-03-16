import { UseCase } from 'domain/definition/UseCase';
import { Right, Left, Either } from 'purify-ts/Either';
import { ISDCFormResponseEntityGateway } from 'domain/usecases/SDCFormResponse/ISDCFormResponseEntityGateway';
import { SDCFormResponse } from 'domain/entities/SDCFormResponse';
import { UpdateSDCFormResponseInvalidRequest } from './UpdateSDCFormResponseErrors';

interface UpdateSDCFormResponseRequestDTO {
  SDCFormResponse: SDCFormResponse;
}

export type UpdateSDCFormResponseResponsesDTO = Either<
  UpdateSDCFormResponseInvalidRequest,
  SDCFormResponse
>;

interface Dependencies {
  SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;
}

export class UpdateSDCFormResponseUseCase
  implements
    UseCase<
      UpdateSDCFormResponseRequestDTO,
      UpdateSDCFormResponseResponsesDTO
    > {
  private SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;

  constructor({ SDCFormResponseEntityGateway }: Dependencies) {
    this.SDCFormResponseEntityGateway = SDCFormResponseEntityGateway;
  }

  async execute(
    request: UpdateSDCFormResponseRequestDTO
  ): Promise<UpdateSDCFormResponseResponsesDTO> {
    try {
      const SDCFormResponse = await this.SDCFormResponseEntityGateway.updateSDCFormResponse(
        request.SDCFormResponse
      );
      if (SDCFormResponse) {
        return Right(SDCFormResponse);
      } else {
        return Left(new UpdateSDCFormResponseInvalidRequest());
      }
    } catch (error) {
      return Left(new UpdateSDCFormResponseInvalidRequest());
    }
  }
}
