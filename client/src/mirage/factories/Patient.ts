import { random as fakerRandom, name as fakerName } from 'faker';
import { PatientDTO } from '../../infrastructure/patient/PatientDto';

export class PatientFactory {
  static createFake(): PatientDTO {
    return {
      OHIPNumber: fakerRandom.uuid(),
      firstName: fakerName.firstName(),
      lastName: fakerName.lastName(),
    };
  }
}
