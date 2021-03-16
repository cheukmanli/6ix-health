import { SDCFormResponseActions } from '.';
import { AppThunk } from '..';
import { diContainer } from '../../../config/injection';
import { SDCForm } from '../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../domain/sdcFormResponse/SDCFormResponse';

export const getAllSDCFormResponses = (): AppThunk => {
  return async function (dispatch) {
    dispatch(SDCFormResponseActions.onStartLoading());
    const { sdcFormResponseService } = diContainer().cradle;
    const SDCFormResponseData = await sdcFormResponseService.getAllSDCFormResponses();
    dispatch(SDCFormResponseActions.onGetSDCFormResponses(SDCFormResponseData));
  };
};

export const getDefaultAnswersForForm = (sdcForm: SDCForm): AppThunk => {
  return async function (dispatch) {
    const { sdcFormResponseService } = diContainer().cradle;
    const SDCFormData = await sdcFormResponseService.getDefaultAnswersForForm(
      sdcForm
    );
    dispatch(SDCFormResponseActions.onGetSDCFormResponses([SDCFormData]));
  };
};

export const submitSDCFormResponse = (
  sdcFormResponse: SDCFormResponse
): AppThunk => {
  return async function (dispatch) {
    const { sdcFormResponseService } = diContainer().cradle;
    const responseOrValidationResults = await sdcFormResponseService.submitSDCFormResponse(
      sdcFormResponse
    );
    dispatch(
      SDCFormResponseActions.onValidateResponseFinished(
        responseOrValidationResults
      )
    );
  };
};
