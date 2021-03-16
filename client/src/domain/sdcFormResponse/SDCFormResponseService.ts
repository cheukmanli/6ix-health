import { SDCForm } from '../sdcForm/SDCForm';
import { FailureOnQuestionsResult } from '../sdcForm/SDCFormResponseValidationResult';
import { SDCFormResponse } from './SDCFormResponse';

export abstract class ISDCFormResponseService {
  abstract getAllSDCFormResponses(): Promise<SDCFormResponse[]>;

  abstract getDefaultAnswersForForm(sdcForm: SDCForm): Promise<SDCFormResponse>;

  abstract submitSDCFormResponse(
    sdcFormResponse: SDCFormResponse
  ): Promise<SDCFormResponse | FailureOnQuestionsResult>;
}
