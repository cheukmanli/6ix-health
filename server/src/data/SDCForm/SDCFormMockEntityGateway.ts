/* eslint-disable @typescript-eslint/no-unused-vars */
import { SDCForm } from 'domain/entities/SDCForm';
import {
  CreateSDCFormPayload,
  ISDCFormEntityGateway,
} from 'domain/usecases/SDCForm/ISDCFormEntityGateway';

export class SDCFormMockEntityGateway implements ISDCFormEntityGateway {
  getSDCForm(SDCFormId: string): Promise<SDCForm | undefined> {
    throw new Error('Method not implemented.');
  }
  updateSDCForm(SDCForm: SDCForm): Promise<SDCForm | undefined> {
    throw new Error('Method not implemented.');
  }
  createSDCForm(payload: CreateSDCFormPayload): Promise<SDCForm> {
    throw new Error('Method not implemented.');
  }
  getSDCForms(
    SDCFormdIds?: string[],
    diagnosticProcedureIds?: string[],
    query?: string
  ): Promise<SDCForm[]> {
    throw new Error('Method not implemented.');
  }
  deleteSDCForms(SDCFormId: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
