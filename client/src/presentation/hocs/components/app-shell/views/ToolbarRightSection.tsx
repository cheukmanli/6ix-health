import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { updateUserType, UserTypes } from '../../../../store/user';
import { RootState } from '../../../../store/rootReducer';

const useStyles = makeStyles({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
    color: 'black',
  },
  userTypeOptionsContainer: {
    flexDirection: 'row',
  },
});

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userType } = useSelector((state: RootState) => ({
    userType: state.user.userType,
  }));

  return (
    <div className={classes.container}>
      <RadioGroup
        className={classes.userTypeOptionsContainer}
        value={userType}
        onChange={(e) => dispatch(updateUserType(e.target.value as UserTypes))}
      >
        <FormControlLabel
          value="formManager"
          control={<Radio />}
          label="Form Manager"
        />

        <FormControlLabel
          value="formFiller"
          control={<Radio />}
          label="Form Filler"
        />
      </RadioGroup>
    </div>
  );
};
