import { UseCase } from 'domain/definition/UseCase';
import { Patient } from 'domain/entities/Patient';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  AlreadyExistsRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IPatientEntityGateway } from '../IPatientEntityGateway';

interface CreatePatientRequestDTO {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

type CreatePatientResponseDTO = Either<
  AlreadyExistsRequestError | ServerRequestError,
  Patient
>;

interface Dependencies {
  patientEntityGateway: IPatientEntityGateway;
}

export class CreatePatientUseCase
  implements UseCase<CreatePatientRequestDTO, CreatePatientResponseDTO> {
  patientEntityGateway: IPatientEntityGateway;
  constructor({ patientEntityGateway }: Dependencies) {
    this.patientEntityGateway = patientEntityGateway;
  }

  async execute(
    request: CreatePatientRequestDTO
  ): Promise<CreatePatientResponseDTO> {
    try {
      const createdPatient = await this.patientEntityGateway.createPatient(
        request
      );
      return Right(createdPatient);
    } catch (error) {
      if (error.message == 'already exists') {
        return Left(new AlreadyExistsRequestError());
      }
      return Left(new ServerRequestError());
    }
  }
}
