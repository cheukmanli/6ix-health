import { RootState } from '../rootReducer';

export const getIsLoading = (state: RootState) => {
  return state.sdcFormResponse.isLoading;
};

export const getAllSDCFormResponsesArray = (state: RootState) => {
  return Object.values(state.sdcFormResponse.SDCFormResponsesMap);
};
