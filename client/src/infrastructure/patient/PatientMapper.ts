import Patient from '../../domain/patient/Patient';
import { PatientDTO } from './PatientDto';

export default class PatientMapper {
  static toDomain(dto: PatientDTO): Patient {
    return new Patient({
      OHIPNumber: dto.OHIPNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  static toDTO(patient: Patient): PatientDTO {
    return {
      OHIPNumber: patient.OHIPNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
    };
  }
}
