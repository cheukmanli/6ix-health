import { UseCase } from 'domain/definition/UseCase';
import { SDCForm } from 'domain/entities/SDCForm';
import { UnknownRequestError } from 'domain/usecases/errors';
import { Either, Right, Left } from 'purify-ts/Either';
import { ISDCFormEntityGateway } from '../ISDCFormEntityGateway';

interface GetSDCFormsRequestDTO {
  SDCFormId?: string[];
  diagnosticProcedureId?: string[];
  query?: string;
}

export type GetSDCFormsResponseDTO = Either<UnknownRequestError, SDCForm[]>;

interface Dependencies {
  SDCFormEntityGateway: ISDCFormEntityGateway;
}
export class GetSDCFormsUseCase
  implements UseCase<GetSDCFormsRequestDTO, GetSDCFormsResponseDTO> {
  private SDCFormEntityGateway: ISDCFormEntityGateway;

  constructor({ SDCFormEntityGateway }: Dependencies) {
    this.SDCFormEntityGateway = SDCFormEntityGateway;
  }

  async execute(
    request: GetSDCFormsRequestDTO
  ): Promise<GetSDCFormsResponseDTO> {
    const { SDCFormId, diagnosticProcedureId, query } = request;

    try {
      const SDCForms = await this.SDCFormEntityGateway.getSDCForms(
        SDCFormId,
        diagnosticProcedureId,
        query
      );
      return Right(SDCForms);
    } catch (error) {
      return Left(new UnknownRequestError());
    }
  }
}
