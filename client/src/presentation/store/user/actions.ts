import { usersActions, UserTypes } from '.';
import { AppThunk } from '..';

export const updateUserType = (newUserType: UserTypes): AppThunk => {
  return async function (dispatch) {
    localStorage.setItem('userType', newUserType);
    dispatch(usersActions.onChangeUserType(newUserType));
  };
};
