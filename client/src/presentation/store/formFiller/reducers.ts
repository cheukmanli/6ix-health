import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import FormFiller from '../../../domain/formFiller/FormFiller';

interface FormFillerState {
  formFillersMap: Record<string, FormFiller>;
}

const initialState: FormFillerState = {
  formFillersMap: {},
};

const formFillersSlice = createSlice({
  name: 'formFillers',
  initialState,
  reducers: {
    onGetFormFillers(state, action: PayloadAction<FormFiller[]>) {
      const formFillers = action.payload;
      const newMap: Record<string, FormFiller> = {};
      formFillers.forEach((p) => {
        newMap[p.formFillerId] = p;
      });
      state.formFillersMap = newMap;
    },
    onAddFormFiller(state, action: PayloadAction<FormFiller>) {
      const formFiller = action.payload;
      state.formFillersMap[formFiller.formFillerId] = formFiller;
    },
    onUpdateFormFiller(state, action: PayloadAction<FormFiller>) {
      const formFiller = action.payload;
      state.formFillersMap[formFiller.formFillerId] = formFiller;
    },
    onDeleteFormFiller(state, action: PayloadAction<FormFiller>) {
      const formFiller = action.payload;
      delete state.formFillersMap[formFiller.formFillerId];
    },
  },
});

export const {
  actions: formFillersActions,
  reducer: formFillersReducer,
} = formFillersSlice;
