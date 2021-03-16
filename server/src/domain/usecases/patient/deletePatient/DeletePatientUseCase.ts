import { UseCase } from 'domain/definition/UseCase';
import {
  NotFoundRequestError,
  ServerRequestError,
} from 'domain/usecases/errors';
import { IPatientEntityGateway } from '../IPatientEntityGateway';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

interface DeletePatientRequestDTO {
  OHIPNumber: string;
}

type DeletePatientResponseDTO = Maybe<
  NotFoundRequestError | ServerRequestError
>;

interface Dependencies {
  patientEntityGateway: IPatientEntityGateway;
}

export class DeletePatientUseCase
  implements UseCase<DeletePatientRequestDTO, DeletePatientResponseDTO> {
  patientEntityGateway: IPatientEntityGateway;
  constructor({ patientEntityGateway }: Dependencies) {
    this.patientEntityGateway = patientEntityGateway;
  }

  async execute(
    request: DeletePatientRequestDTO
  ): Promise<DeletePatientResponseDTO> {
    try {
      await this.patientEntityGateway.deletePatient(request.OHIPNumber);
    } catch (error) {
      if (error.message === 'not found') {
        return Just(new NotFoundRequestError());
      }

      return Just(new ServerRequestError());
    }
    return Nothing;
  }
}
