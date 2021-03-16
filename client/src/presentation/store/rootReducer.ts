import { combineReducers } from '@reduxjs/toolkit';
import { patientsReducer } from './patient';
import { SDCReducer } from './sdcForm';
import { formFillersReducer } from './formFiller';
import { usersReducer } from './user';
import { SDCFormResponseReducer } from './sdcFormResponse';

export const rootReducer = combineReducers({
  formFiller: formFillersReducer,
  patient: patientsReducer,
  sdc: SDCReducer,
  sdcFormResponse: SDCFormResponseReducer,
  user: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
