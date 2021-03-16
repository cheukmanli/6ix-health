import { RootState } from '../rootReducer';

export const getAllFormFillersDataMap = (state: RootState) => {
  return state.formFiller.formFillersMap;
};

export const getAllFormFillersDataArray = (state: RootState) => {
  return Object.values(state.formFiller.formFillersMap);
};
