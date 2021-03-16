import { SDCForm } from '../../domain/sdcForm/SDCForm';
import { FailureOnQuestionsResult } from '../../domain/sdcForm/SDCFormResponseValidationResult';
import { SDCFormResponse } from '../../domain/sdcFormResponse/SDCFormResponse';
import { ISDCFormResponseRepository } from '../../domain/sdcFormResponse/SDCFormResponseRepository';
import { ISDCFormResponseService } from '../../domain/sdcFormResponse/SDCFormResponseService';

interface Dependencies {
  sdcFormResponseRepository: ISDCFormResponseRepository;
}

export default class SDCFormResponseServiceImpl
  implements ISDCFormResponseService {
  repository: ISDCFormResponseRepository;

  constructor({ sdcFormResponseRepository }: Dependencies) {
    this.repository = sdcFormResponseRepository;
  }

  async getAllSDCFormResponses(): Promise<SDCFormResponse[]> {
    return this.repository.getAllSDCFormResponses();
  }

  getDefaultAnswersForForm(sdcForm: SDCForm): Promise<SDCFormResponse> {
    return this.repository.getDefaultAnswersForForm(sdcForm);
  }

  submitSDCFormResponse(
    sdcFormResponse: SDCFormResponse
  ): Promise<SDCFormResponse | FailureOnQuestionsResult> {
    return this.repository.submitSDCFormResponse(sdcFormResponse);
  }
}
