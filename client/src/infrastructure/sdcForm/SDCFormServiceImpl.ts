import { SDCForm } from '../../domain/sdcForm/SDCForm';
import { ISDCFormRepository } from '../../domain/sdcForm/SDCFormRepository';
import { ISDCFormService } from '../../domain/sdcForm/SDCFormService';

interface Dependencies {
  sdcFormRepository: ISDCFormRepository;
}

export default class SDCFormServiceImpl implements ISDCFormService {
  repository: ISDCFormRepository;

  constructor({ sdcFormRepository }: Dependencies) {
    this.repository = sdcFormRepository;
  }

  async addSDCForm(sdcFormXML: File): Promise<SDCForm> {
    return this.repository.addSDCForm(sdcFormXML);
  }

  async getAllSDCForms(): Promise<SDCForm[]> {
    return this.repository.getAllSDCForms();
  }

  async querySDCForms(
    SDCFormIds: string[],
    diagnosticProcedureIds: string[],
    queryText: string
  ): Promise<SDCForm[]> {
    return this.repository.querySDCForms(
      SDCFormIds,
      diagnosticProcedureIds,
      queryText
    );
  }

  async getSDCFormsByIds(...ids: string[]): Promise<SDCForm[]> {
    return this.repository.getSDCFormsByIds(...ids);
  }

  async updateSDCForm(sdcForm: SDCForm, sdcFormXML: File): Promise<SDCForm> {
    return this.repository.updateSDCForm(sdcForm, sdcFormXML);
  }

  async deleteSDCForm(...ids: string[]): Promise<void> {
    return this.repository.deleteSDCForm(...ids);
  }
}
