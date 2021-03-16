import { formFillersActions } from '.';
import { AppThunk } from '..';
import { diContainer } from '../../../config/injection';
import FormFiller from '../../../domain/formFiller/FormFiller';

export const addFormFiller = (formFiller: FormFiller): AppThunk => {
  return async function (dispatch) {
    const { formFillerService } = diContainer().cradle;
    const createdFormFiller = await formFillerService.addFormFiller(formFiller);

    dispatch(formFillersActions.onAddFormFiller(createdFormFiller));
  };
};

export const getFormFillers = (): AppThunk => {
  return async function (dispatch) {
    const { formFillerService } = diContainer().cradle;
    const formFillerData = await formFillerService.getFormFillers();
    dispatch(formFillersActions.onGetFormFillers(formFillerData));
  };
};

export const updateFormFiller = (formFiller: FormFiller): AppThunk => {
  return async function (dispatch) {
    const { formFillerService } = diContainer().cradle;
    const updatedFormFiller = await formFillerService.updateFormFiller(
      formFiller
    );
    dispatch(formFillersActions.onUpdateFormFiller(updatedFormFiller));
  };
};

export const deleteFormFiller = (formFiller: FormFiller): AppThunk => {
  return async function (dispatch) {
    const { formFillerService } = diContainer().cradle;
    await formFillerService.deleteFormFiller(formFiller);
    dispatch(formFillersActions.onDeleteFormFiller(formFiller));
  };
};
