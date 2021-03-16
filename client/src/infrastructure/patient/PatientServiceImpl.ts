import Patient from '../../domain/patient/Patient';
import { IPatientRepository } from '../../domain/patient/PatientRepository';
import { IPatientService } from '../../domain/patient/PatientService';

interface Dependencies {
  patientRepository: IPatientRepository;
}

export default class PatientServiceImpl implements IPatientService {
  patientRepository: IPatientRepository;

  constructor({ patientRepository }: Dependencies) {
    this.patientRepository = patientRepository;
  }

  async addPatient(patient: Patient): Promise<Patient> {
    return this.patientRepository.addPatient(patient);
  }

  async getPatients(): Promise<Patient[]> {
    return this.patientRepository.getPatients();
  }

  async updatePatient(patient: Patient): Promise<Patient> {
    return this.patientRepository.updatePatient(patient);
  }

  async deletePatient(patient: Patient): Promise<void> {
    return this.patientRepository.deletePatient(patient);
  }
}
