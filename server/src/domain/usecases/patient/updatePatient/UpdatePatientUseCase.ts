import { UseCase } from 'domain/definition/UseCase';
import { Patient } from 'domain/entities/Patient';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IPatientEntityGateway } from '../IPatientEntityGateway';

interface UpdatePatientRequestDTO {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

type UpdatePatientResponseDTO = Either<
  NotFoundRequestError | ServerRequestError,
  Patient
>;

interface Dependencies {
  patientEntityGateway: IPatientEntityGateway;
}

export class UpdatePatientUseCase
  implements UseCase<UpdatePatientRequestDTO, UpdatePatientResponseDTO> {
  patientEntityGateway: IPatientEntityGateway;
  constructor({ patientEntityGateway }: Dependencies) {
    this.patientEntityGateway = patientEntityGateway;
  }

  async execute(
    request: UpdatePatientRequestDTO
  ): Promise<UpdatePatientResponseDTO> {
    try {
      const UpdatedPatient = await this.patientEntityGateway.updatePatient(
        request
      );
      return Right(UpdatedPatient);
    } catch (error) {
      if (error.message == 'not found') {
        return Left(new NotFoundRequestError());
      }
      return Left(new ServerRequestError());
    }
  }
}
