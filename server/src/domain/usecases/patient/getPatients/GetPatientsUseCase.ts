import { UseCase } from 'domain/definition/UseCase';
import { Patient } from 'domain/entities/Patient';
import { Either, Left, Right } from 'purify-ts/Either';
import { ServerRequestError } from 'domain/usecases/errors';
import { IPatientEntityGateway } from '../IPatientEntityGateway';

type GetPatientsResponseDTO = Either<ServerRequestError, Patient[]>;

interface Dependencies {
  patientEntityGateway: IPatientEntityGateway;
}

export class GetPatientsUseCase implements UseCase<{}, GetPatientsResponseDTO> {
  patientEntityGateway: IPatientEntityGateway;
  constructor({ patientEntityGateway }: Dependencies) {
    this.patientEntityGateway = patientEntityGateway;
  }

  async execute(): Promise<GetPatientsResponseDTO> {
    try {
      const allPatients = await this.patientEntityGateway.getPatients();
      return Right(allPatients);
    } catch (error) {
      return Left(new ServerRequestError());
    }
  }
}
