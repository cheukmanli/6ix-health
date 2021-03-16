import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { RootState } from '../../../store/rootReducer';
import { presentationEnums } from '../../../core/enums';
import {
  addFormFiller,
  getAllFormFillersDataArray,
  updateFormFiller,
} from '../../../store/formFiller';
import FormFiller from '../../../../domain/formFiller/FormFiller';

const useStyles = makeStyles({
  container: {
    margin: '8px 0',
  },
  formItemsContainer: {
    margin: 20,
    '& > *': {
      margin: '10px 0',
      '&:first-child': {
        marginBottom: '0',
      },
    },
  },
});

export default () => {
  const { routeNames } = presentationEnums;
  const classes = useStyles();
  const query = new URLSearchParams(useLocation().search);
  const formFillerWithFormFillerIdToRender = query.get('formFillerId');
  const isCreatingNewFormFiller = !formFillerWithFormFillerIdToRender;

  const { formFillersData } = useSelector((state: RootState) => ({
    formFillersData: getAllFormFillersDataArray(state),
  }));

  const maybeFormFiller = formFillersData.find(
    (formFiller) =>
      formFiller.formFillerId === formFillerWithFormFillerIdToRender
  );

  const [formFillerId, setFormFillerId] = useState(
    maybeFormFiller?.formFillerId || ''
  );

  const [firstName, setFirstName] = useState(maybeFormFiller?.firstName || '');
  const [lastName, setLastName] = useState(maybeFormFiller?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async () => {
    setIsLoading(true);

    const newOrUpdatedFormFiller = new FormFiller({
      formFillerId,
      firstName,
      lastName,
    });

    await dispatch(
      isCreatingNewFormFiller
        ? addFormFiller(newOrUpdatedFormFiller)
        : updateFormFiller(newOrUpdatedFormFiller)
    );

    history.push(routeNames.formFillers.base);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h2" align="center">
        {isCreatingNewFormFiller ? 'Add Form Filler' : 'Update Form FIller'}
      </Typography>

      {isLoading ? (
        'Loading...'
      ) : (
        <Card>
          <form autoComplete="off">
            <div className={classes.formItemsContainer}>
              <TextField
                required
                fullWidth
                disabled={!isCreatingNewFormFiller}
                label="Form Filler ID"
                value={formFillerId}
                onChange={(e) => setFormFillerId(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isCreatingNewFormFiller
                  ? 'Add Form Filler'
                  : 'Update Form Filler'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
