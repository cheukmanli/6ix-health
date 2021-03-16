import { RootState } from '../rootReducer';

export const getAllSDCFormsMap = (state: RootState) => {
  return state.sdc.SDCFormsMap;
};

export const getAllSDCFormsArray = (state: RootState) => {
  return Object.values(state.sdc.SDCFormsMap);
};

export const getAllSearchedSDCFormsArray = (state: RootState) => {
  if (state.sdc.searchedSDCFormsMap)
    return Object.values(state.sdc.searchedSDCFormsMap);
  return null;
};
