import Patient from './Patient';

export abstract class IPatientRepository {
  abstract addPatient(patient: Patient): Promise<Patient>;

  abstract getPatients(): Promise<Patient[]>;

  abstract updatePatient(patient: Patient): Promise<Patient>;

  abstract deletePatient(patient: Patient): Promise<void>;
}
