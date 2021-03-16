import FormFiller from './FormFiller';

export abstract class IFormFillerRepository {
  abstract addFormFiller(formFiller: FormFiller): Promise<FormFiller>;

  abstract getFormFillers(): Promise<FormFiller[]>;

  abstract updateFormFiller(formFiller: FormFiller): Promise<FormFiller>;

  abstract deleteFormFiller(formFiller: FormFiller): Promise<void>;
}
