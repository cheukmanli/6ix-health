import { RootState } from '../rootReducer';

export const getAllPatientsDataMap = (state: RootState) => {
  return state.patient.patientsMap;
};

export const getAllPatientsDataArray = (state: RootState) => {
  return Object.values(state.patient.patientsMap);
};
