import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import Patient from '../../../../domain/patient/Patient';
import {
  addPatient,
  getAllPatientsDataArray,
  updatePatient,
} from '../../../store/patient';
import { presentationEnums } from '../../../core/enums';
import { RootState } from '../../../store/rootReducer';

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
  const patientWithOHIPNumberToRender = query.get('OHIPNumber');
  const isCreatingNewPatient = !patientWithOHIPNumberToRender;

  const { patientsData } = useSelector((state: RootState) => ({
    patientsData: getAllPatientsDataArray(state),
  }));

  const maybePatient = patientsData.find(
    (patient) => patient.OHIPNumber === patientWithOHIPNumberToRender
  );

  const [OHIPNumber, setOHIPNumber] = useState(maybePatient?.OHIPNumber || '');
  const [firstName, setFirstName] = useState(maybePatient?.firstName || '');
  const [lastName, setLastName] = useState(maybePatient?.lastName || '');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async () => {
    setIsLoading(true);

    const newOrUpdatedPatient = new Patient({
      OHIPNumber,
      firstName,
      lastName,
    });

    await dispatch(
      isCreatingNewPatient
        ? addPatient(newOrUpdatedPatient)
        : updatePatient(newOrUpdatedPatient)
    );

    history.push(routeNames.patients.base);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h2" align="center">
        {isCreatingNewPatient ? 'Add Patient' : 'Update Patient'}
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
                disabled={!isCreatingNewPatient}
                label="OHIP Number"
                value={OHIPNumber}
                onChange={(e) => setOHIPNumber(e.target.value)}
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
                {isCreatingNewPatient ? 'Add Patient' : 'Update Patient'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
