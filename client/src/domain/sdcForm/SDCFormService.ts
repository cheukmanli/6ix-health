import { SDCForm } from './SDCForm';

export abstract class ISDCFormService {
  abstract addSDCForm(sdcFormXML: File): Promise<SDCForm>;

  abstract getSDCFormsByIds(...ids: string[]): Promise<SDCForm[]>;

  abstract querySDCForms(
    SDCFormIds: string[],
    diagnosticProcedureIds: string[],
    query: string
  ): Promise<SDCForm[]>;

  abstract getAllSDCForms(): Promise<SDCForm[]>;

  abstract updateSDCForm(sdcForm: SDCForm, sdcFormXML: File): Promise<SDCForm>;

  abstract deleteSDCForm(...ids: string[]): Promise<void>;
}
