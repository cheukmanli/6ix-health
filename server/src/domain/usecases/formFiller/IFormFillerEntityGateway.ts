import { FormFiller } from 'domain/entities/FormFiller';

export interface CreateFormFillerPayload {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

export interface UpdateFormFillerPayload {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

export abstract class IFormFillerEntityGateway {
  abstract getFormFillers(): Promise<FormFiller[]>;

  abstract createFormFiller(
    payload: CreateFormFillerPayload
  ): Promise<FormFiller>;

  abstract updateFormFiller(
    payload: UpdateFormFillerPayload
  ): Promise<FormFiller>;

  abstract deleteFormFiller(FormFillerId: string): Promise<void>;
}
