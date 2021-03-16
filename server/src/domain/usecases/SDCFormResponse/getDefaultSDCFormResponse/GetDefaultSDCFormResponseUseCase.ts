import { UseCase } from 'domain/definition/UseCase';
import { Right, Left, Either } from 'purify-ts/Either';
import { ISDCFormEntityGateway } from 'domain/usecases/SDCForm/ISDCFormEntityGateway';
import { SDCFormResponse } from 'domain/entities/SDCFormResponse';
import { GetDefaultSDCFormResponseInvalidRequest } from './GetDefaultSDCFormResponseErrors';
import { generateInitialSDCFormResponse } from './utils';
interface GetDefaultSDCFormResponseRequestDTO {
  SDCFormId: string;
}

export type GetDefaultSDCFormResponseResponseDTO = Either<
  GetDefaultSDCFormResponseInvalidRequest,
  Pick<SDCFormResponse, 'SDCFormId' | 'diagnosticProcedureId' | 'answers'>
>;

interface Dependencies {
  SDCFormEntityGateway: ISDCFormEntityGateway;
}

export class GetDefaultSDCFormResponseUseCase
  implements
    UseCase<
      GetDefaultSDCFormResponseRequestDTO,
      GetDefaultSDCFormResponseResponseDTO
    > {
  private SDCFormEntityGateway: ISDCFormEntityGateway;

  constructor({ SDCFormEntityGateway }: Dependencies) {
    this.SDCFormEntityGateway = SDCFormEntityGateway;
  }

  async execute(
    request: GetDefaultSDCFormResponseRequestDTO
  ): Promise<GetDefaultSDCFormResponseResponseDTO> {
    try {
      const SDCForm = await this.SDCFormEntityGateway.getSDCForm(
        request.SDCFormId
      );

      let SDCFormResponse: Pick<
        SDCFormResponse,
        'SDCFormId' | 'diagnosticProcedureId' | 'answers'
      >;

      if (SDCForm) {
        SDCFormResponse = generateInitialSDCFormResponse(SDCForm);
      } else {
        return Left(new GetDefaultSDCFormResponseInvalidRequest());
      }

      if (SDCFormResponse) {
        return Right(SDCFormResponse);
      } else {
        return Left(new GetDefaultSDCFormResponseInvalidRequest());
      }
    } catch (error) {
      return Left(new GetDefaultSDCFormResponseInvalidRequest());
    }
  }
}
