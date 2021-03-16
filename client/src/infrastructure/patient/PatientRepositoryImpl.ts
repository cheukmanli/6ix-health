import axios from 'axios';
import Patient from '../../domain/patient/Patient';
import { IPatientRepository } from '../../domain/patient/PatientRepository';
import { PatientDTO } from './PatientDto';
import PatientMapper from './PatientMapper';

const patientApiURL = '/api/v1/patient';
export default class PatientRepositoryImpl implements IPatientRepository {
  async addPatient(patient: Patient): Promise<Patient> {
    const patientToBeCreateDto = PatientMapper.toDTO(patient);

    const res = await axios.post<PatientDTO>(
      patientApiURL,
      patientToBeCreateDto
    );

    return PatientMapper.toDomain(res.data);
  }

  async getPatients(): Promise<Patient[]> {
    const res = await axios.get<PatientDTO[]>(patientApiURL);
    return res.data.map(PatientMapper.toDomain);
  }

  async updatePatient(patient: Patient): Promise<Patient> {
    const patientToBeUpdatedDto = PatientMapper.toDTO(patient);

    const res = await axios.put<PatientDTO>(
      patientApiURL,
      patientToBeUpdatedDto
    );

    return PatientMapper.toDomain(res.data);
  }

  async deletePatient(patient: Patient): Promise<void> {
    await axios(patientApiURL, {
      method: 'delete',
      data: PatientMapper.toDTO(patient),
    });
  }
}
