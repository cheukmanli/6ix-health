/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormFiller } from 'domain/entities/FormFiller';
import {
  CreateFormFillerPayload,
  IFormFillerEntityGateway,
  UpdateFormFillerPayload,
} from 'domain/usecases/formFiller/IFormFillerEntityGateway';

export class FormFillerMockEntityGateway implements IFormFillerEntityGateway {
  getFormFillers(): Promise<FormFiller[]> {
    throw new Error('Method not implemented.');
  }
  createFormFiller(payload: CreateFormFillerPayload): Promise<FormFiller> {
    throw new Error('Method not implemented.');
  }
  updateFormFiller(payload: UpdateFormFillerPayload): Promise<FormFiller> {
    throw new Error('Method not implemented.');
  }
  deleteFormFiller(FormFillerId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
