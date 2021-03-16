import { Record } from 'immutable';

interface FormFillerModel {
  formFillerId: string;
  firstName: string;
  lastName: string;
}

const FormFillerRecord = Record<FormFillerModel>({
  formFillerId: '',
  firstName: '',
  lastName: '',
});

export default class FormFiller extends FormFillerRecord {}
