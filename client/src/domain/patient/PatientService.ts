import Patient from './Patient';

export abstract class IPatientService {
  abstract addPatient(patient: Patient): Promise<Patient>;

  abstract getPatients(): Promise<Patient[]>;

  abstract updatePatient(patient: Patient): Promise<Patient>;

  abstract deletePatient(patient: Patient): Promise<void>;
}
