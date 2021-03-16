import FormFiller from '../../domain/formFiller/FormFiller';
import { IFormFillerRepository } from '../../domain/formFiller/FormFillerRepository';
import { IFormFillerService } from '../../domain/formFiller/FormFillerService';

interface Dependencies {
  formFillerRepository: IFormFillerRepository;
}

export default class FormFillerServiceImpl implements IFormFillerService {
  formFillerRepository: IFormFillerRepository;

  constructor({ formFillerRepository }: Dependencies) {
    this.formFillerRepository = formFillerRepository;
  }

  async addFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    return this.formFillerRepository.addFormFiller(formFiller);
  }

  async getFormFillers(): Promise<FormFiller[]> {
    return this.formFillerRepository.getFormFillers();
  }

  async updateFormFiller(formFiller: FormFiller): Promise<FormFiller> {
    return this.formFillerRepository.updateFormFiller(formFiller);
  }

  async deleteFormFiller(formFiller: FormFiller): Promise<void> {
    return this.formFillerRepository.deleteFormFiller(formFiller);
  }
}
