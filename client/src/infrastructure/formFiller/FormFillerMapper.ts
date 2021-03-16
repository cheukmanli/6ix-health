import FormFiller from '../../domain/formFiller/FormFiller';
import { FormFillerDTO } from './FormFillerDto';

export default class FormFillerMapper {
  static toDomain(dto: FormFillerDTO): FormFiller {
    return new FormFiller({
      formFillerId: dto.formFillerId,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  static toDTO(patient: FormFiller): FormFillerDTO {
    return {
      formFillerId: patient.formFillerId,
      firstName: patient.firstName,
      lastName: patient.lastName,
    };
  }
}
