import { SDCForm } from 'domain/entities/SDCForm';

export interface CreateSDCFormPayload {
  XMLString: string;
}

export abstract class ISDCFormEntityGateway {
  abstract getSDCForm(SDCFormId: string): Promise<SDCForm | undefined>;

  abstract updateSDCForm(SDCForm: SDCForm): Promise<SDCForm | undefined>;

  abstract createSDCForm(payload: CreateSDCFormPayload): Promise<SDCForm>;

  abstract getSDCForms(
    SDCFormdIds?: string[],
    diagnosticProcedureIds?: string[],
    query?: string
  ): Promise<SDCForm[]>;

  abstract deleteSDCForms(SDCFormId: string[]): Promise<void>;
}
