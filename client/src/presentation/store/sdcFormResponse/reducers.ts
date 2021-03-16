import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FailureOnQuestionsResult } from '../../../domain/sdcForm/SDCFormResponseValidationResult';
import { SDCFormResponse } from '../../../domain/sdcFormResponse/SDCFormResponse';

interface SDCFormResponseState {
  SDCFormResponsesMap: Record<string, SDCFormResponse>;
  validateFormResponseResult: SDCFormResponse | FailureOnQuestionsResult | null;
  isLoading: boolean;
}

const initialState: SDCFormResponseState = {
  SDCFormResponsesMap: {},
  validateFormResponseResult: null,
  isLoading: false,
};

const SDCFormResponseSlice = createSlice({
  name: 'sdcFormResponse',
  initialState,
  reducers: {
    onStartLoading(state) {
      state.isLoading = true;
    },
    onGetSDCFormResponses(state, action: PayloadAction<SDCFormResponse[]>) {
      const forms = action.payload;
      const newMap: Record<string, SDCFormResponse> = {};
      forms.forEach((form) => {
        newMap[form.sdcFormId] = form;
      });
      state.SDCFormResponsesMap = newMap;
      state.isLoading = initialState.isLoading;
    },
    onValidateResponseFinished(
      state,
      action: PayloadAction<SDCFormResponse | FailureOnQuestionsResult>
    ) {
      state.validateFormResponseResult = action.payload;
    },
  },
});

export const {
  actions: SDCFormResponseActions,
  reducer: SDCFormResponseReducer,
} = SDCFormResponseSlice;
