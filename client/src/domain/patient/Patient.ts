import { Record } from 'immutable';

interface UserModel {
  OHIPNumber: string;
  firstName: string;
  lastName: string;
}

const PatientRecord = Record<UserModel>({
  OHIPNumber: '',
  firstName: '',
  lastName: '',
});

export default class Patient extends PatientRecord {}
