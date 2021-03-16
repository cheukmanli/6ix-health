import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Patient from '../../../domain/patient/Patient';

interface PatientState {
  patientsMap: Record<string, Patient>;
}

const initialState: PatientState = {
  patientsMap: {},
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    onGetPatients(state, action: PayloadAction<Patient[]>) {
      const patients = action.payload;
      const newMap: Record<string, Patient> = {};
      patients.forEach((p) => {
        newMap[p.OHIPNumber] = p;
      });
      state.patientsMap = newMap;
    },
    onAddPatient(state, action: PayloadAction<Patient>) {
      const patient = action.payload;
      state.patientsMap[patient.OHIPNumber] = patient;
    },
    onUpdatePatient(state, action: PayloadAction<Patient>) {
      const patient = action.payload;
      state.patientsMap[patient.OHIPNumber] = patient;
    },
    onDeletePatient(state, action: PayloadAction<Patient>) {
      const patient = action.payload;
      delete state.patientsMap[patient.OHIPNumber];
    },
  },
});

export const {
  actions: patientsActions,
  reducer: patientsReducer,
} = patientsSlice;
