import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserTypes = 'formManager' | 'formFiller';

interface UserState {
  userType: UserTypes;
}

const initialState: UserState = {
  userType: (localStorage.getItem('userType') || 'formManager') as UserTypes,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    onChangeUserType(state, action: PayloadAction<UserTypes>) {
      const newUserType = action.payload;
      state.userType = newUserType;
    },
  },
});

export const { actions: usersActions, reducer: usersReducer } = usersSlice;
