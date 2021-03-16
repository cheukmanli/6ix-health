import { random as fakerRandom, name as fakerName } from 'faker';
import { FormFillerDTO } from '../../infrastructure/formFiller/FormFillerDto';

export class FormFillerFactory {
  static createFake(): FormFillerDTO {
    return {
      formFillerId: fakerRandom.uuid(),
      firstName: fakerName.firstName(),
      lastName: fakerName.lastName(),
    };
  }
}
