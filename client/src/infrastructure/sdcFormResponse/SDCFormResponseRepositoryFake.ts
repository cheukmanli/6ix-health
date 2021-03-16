import range from 'lodash/range';
import { SDCForm } from '../../domain/sdcForm/SDCForm';
import { FailureOnQuestionsResult } from '../../domain/sdcForm/SDCFormResponseValidationResult';
import { SDCFormResponse } from '../../domain/sdcFormResponse/SDCFormResponse';
import { ISDCFormResponseRepository } from '../../domain/sdcFormResponse/SDCFormResponseRepository';
import { SDCFormResponseFactory } from '../../mirage/factories/SDCFormResponse';
import SDCFormResponseMapper from './SDCFormResponseMapper';

export class SDCFormResponseRepositoryFake
  implements ISDCFormResponseRepository {
  async getAllSDCFormResponses(): Promise<SDCFormResponse[]> {
    await new Promise((res) => setTimeout(res, 1000));

    const SDCFormResponseDto = range(25).map(() =>
      SDCFormResponseFactory.createFake()
    );
    return SDCFormResponseDto.map(SDCFormResponseMapper.toDomain);
  }

  async getDefaultAnswersForForm(sdcForm: SDCForm): Promise<SDCFormResponse> {
    return SDCFormResponseMapper.toDomain(
      SDCFormResponseFactory.createDefaultAnswersFake({
        SDCFormId: sdcForm.SDCFormId,
      })
    );
  }

  submitSDCFormResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sdcFormResponse: SDCFormResponse
  ): Promise<SDCFormResponse | FailureOnQuestionsResult> {
    throw new Error('Method not implemented.');
  }
}
