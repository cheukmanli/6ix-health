import { Patient } from 'domain/entities/Patient';

export interface CreatePatientPayload {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePatientPayload {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

export abstract class IPatientEntityGateway {
  abstract getPatients(): Promise<Patient[]>;

  abstract createPatient(payload: CreatePatientPayload): Promise<Patient>;

  abstract updatePatient(payload: UpdatePatientPayload): Promise<Patient>;

  abstract deletePatient(OHIPNumber: string): Promise<void>;
}
