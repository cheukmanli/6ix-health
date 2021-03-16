import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SDCForm } from '../../../domain/sdcForm/SDCForm';

interface SDCState {
  SDCFormsMap: Record<string, SDCForm>;
  searchedSDCFormsMap: Record<string, SDCForm> | null;
  isSearching: boolean;
  searchError: boolean;
}

const initialState: SDCState = {
  SDCFormsMap: {},
  searchedSDCFormsMap: null,
  isSearching: false,
  searchError: false,
};

const SDCSlice = createSlice({
  name: 'sdcForm',
  initialState,
  reducers: {
    onStartSearch(state) {
      state.isSearching = true;
    },
    clearSearchResults(state) {
      state.searchedSDCFormsMap = initialState.searchedSDCFormsMap;
      state.searchError = false;
    },
    onSearchSDCFormsSuccess(state, action: PayloadAction<SDCForm[]>) {
      const forms = action.payload;
      const newMap: Record<string, SDCForm> = {};
      forms.forEach((form) => {
        newMap[form.SDCFormId] = form;
      });
      state.searchError = false;
      state.searchedSDCFormsMap = newMap;
      state.isSearching = false;
    },
    onSearchSDCFormsFailure(state) {
      state.searchError = true;
      state.isSearching = false;
    },
    onGetSDCFormsSuccess(state, action: PayloadAction<SDCForm[]>) {
      const forms = action.payload;
      const newMap: Record<string, SDCForm> = {};
      forms.forEach((form) => {
        newMap[form.SDCFormId] = form;
      });
      state.SDCFormsMap = newMap;
    },
    onAddSDCForm(state, action: PayloadAction<SDCForm>) {
      const form = action.payload;
      state.SDCFormsMap[form.SDCFormId] = form;
    },
    onUpdateSDCForm(state, action: PayloadAction<SDCForm>) {
      const form = action.payload;
      state.SDCFormsMap[form.SDCFormId] = form;
      if (state.searchedSDCFormsMap) {
        state.searchedSDCFormsMap[form.SDCFormId] = form;
      }
    },
    onDeleteSDCForm(state, action: PayloadAction<SDCForm>) {
      const form = action.payload;
      delete state.SDCFormsMap[form.SDCFormId];
      if (state.searchedSDCFormsMap) {
        delete state.searchedSDCFormsMap[form.SDCFormId];
      }
    },
  },
});

export const { actions: SDCActions, reducer: SDCReducer } = SDCSlice;
