/* eslint-disable @typescript-eslint/no-unused-vars */
import { Patient } from 'domain/entities/Patient';
import {
  CreatePatientPayload,
  IPatientEntityGateway,
  UpdatePatientPayload,
} from 'domain/usecases/patient/IPatientEntityGateway';

export class PatientMockEntityGateway implements IPatientEntityGateway {
  getPatients(): Promise<Patient[]> {
    throw new Error('Method not implemented.');
  }
  createPatient(payload: CreatePatientPayload): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
  updatePatient(payload: UpdatePatientPayload): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
  deletePatient(OHIPNumber: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
