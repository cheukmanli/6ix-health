import { patientsActions } from '.';
import { AppThunk } from '..';
import { diContainer } from '../../../config/injection';
import Patient from '../../../domain/patient/Patient';

export const addPatient = (patient: Patient): AppThunk => {
  return async function (dispatch) {
    const { patientService } = diContainer().cradle;
    const createdPatient = await patientService.addPatient(patient);

    dispatch(patientsActions.onAddPatient(createdPatient));
  };
};

export const getPatients = (): AppThunk => {
  return async function (dispatch) {
    const { patientService } = diContainer().cradle;
    const patientData = await patientService.getPatients();
    dispatch(patientsActions.onGetPatients(patientData));
  };
};

export const updatePatient = (patient: Patient): AppThunk => {
  return async function (dispatch) {
    const { patientService } = diContainer().cradle;
    const updatedPatient = await patientService.updatePatient(patient);
    dispatch(patientsActions.onUpdatePatient(updatedPatient));
  };
};

export const deletePatient = (patient: Patient): AppThunk => {
  return async function (dispatch) {
    const { patientService } = diContainer().cradle;
    await patientService.deletePatient(patient);
    dispatch(patientsActions.onDeletePatient(patient));
  };
};
