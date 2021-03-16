import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { rootReducer, RootState } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    // this needs to be disabled since we are passing objects from immutable package in our reducers, causing a warning to appear in devtools
    // more info: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
