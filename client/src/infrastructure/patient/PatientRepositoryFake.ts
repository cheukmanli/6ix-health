/* eslint-disable @typescript-eslint/camelcase */
import Patient from '../../domain/patient/Patient';
import { IPatientRepository } from '../../domain/patient/PatientRepository';
import { PatientDTO } from './PatientDto';
import PatientMapper from './PatientMapper';

interface Dependencies {
  patientDb: PouchDB.Database<PatientDTO>;
}

export class PatientRepositoryFake implements IPatientRepository {
  private db: PouchDB.Database<PatientDTO>;

  constructor({ patientDb }: Dependencies) {
    this.db = patientDb;
  }

  async addPatient(patient: Patient): Promise<Patient> {
    const patientDto = PatientMapper.toDTO(patient);
    await this.db.put({ ...patientDto, _id: patientDto.OHIPNumber });
    return PatientMapper.toDomain(patientDto);
  }

  async getPatients(): Promise<Patient[]> {
    await new Promise((res) => setTimeout(res, 1000));
    const allDocsResponse = await this.db.allDocs({ include_docs: true });
    return allDocsResponse.rows.map((document) =>
      PatientMapper.toDomain(document.doc as PatientDTO)
    );
  }

  async updatePatient(patient: Patient): Promise<Patient> {
    const patientDto = PatientMapper.toDTO(patient);
    const { _id, _rev } = await this.db.get(patientDto.OHIPNumber);

    await this.db.put({
      ...patientDto,
      _id,
      _rev,
    });

    return patient;
  }

  async deletePatient(patient: Patient): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
    const patientDto = PatientMapper.toDTO(patient);
    const currentlyStoredPatient = await this.db.get(patientDto.OHIPNumber);
    await this.db.remove(currentlyStoredPatient);
  }
}
