import { UseCase } from 'domain/definition/UseCase';
import { Right, Left, Either } from 'purify-ts/Either';
import { ISDCFormResponseEntityGateway } from 'domain/usecases/SDCFormResponse/ISDCFormResponseEntityGateway';
import { SDCFormResponse } from 'domain/entities/SDCFormResponse';
import { GetSDCFormResponsesInvalidRequest } from './GetSDCFormResponsesErrors';
import { NotFoundRequestError } from 'domain/usecases/errors';

interface GetSDCFormResponsesRequestDTO {
  SDCFormId: string | undefined;
}

export type GetSDCFormResponsesResponseDTO = Either<
  NotFoundRequestError | GetSDCFormResponsesInvalidRequest,
  SDCFormResponse[]
>;

interface Dependencies {
  SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;
}

export class GetSDCFormResponsesUseCase
  implements
    UseCase<GetSDCFormResponsesRequestDTO, GetSDCFormResponsesResponseDTO> {
  private SDCFormResponseEntityGateway: ISDCFormResponseEntityGateway;

  constructor({ SDCFormResponseEntityGateway }: Dependencies) {
    this.SDCFormResponseEntityGateway = SDCFormResponseEntityGateway;
  }

  async execute(
    request: GetSDCFormResponsesRequestDTO
  ): Promise<GetSDCFormResponsesResponseDTO> {
    try {
      const SDCFormResponse = await this.SDCFormResponseEntityGateway.getSDCFormResponses(
        request.SDCFormId
      );
      if (SDCFormResponse) {
        return Right(SDCFormResponse);
      } else {
        return Left(new GetSDCFormResponsesInvalidRequest());
      }
    } catch (error) {
      if (error.message == 'SDCFormResponses not found') {
        return Left(new NotFoundRequestError());
      } else {
        return Left(new GetSDCFormResponsesInvalidRequest());
      }
    }
  }
}
