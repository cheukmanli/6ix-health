import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CreateIconOutlined from '@material-ui/icons/CreateOutlined';
import DeleteIconOutlined from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { presentationEnums } from '../../core/enums';
import Patient from '../../../domain/patient/Patient';
import { RootState } from '../../store/rootReducer';
import {
  deletePatient,
  getAllPatientsDataArray,
  getPatients,
} from '../../store/patient';

const useStyles = makeStyles({
  container: {
    margin: '0px 8px',
  },
  loadingText: {
    padding: '20px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default () => {
  const { routeNames } = presentationEnums;
  const classes = useStyles();

  const { patientsData } = useSelector((state: RootState) => ({
    patientsData: getAllPatientsDataArray(state),
  }));

  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const addPatientHandler = () => {
    history.push(routeNames.patients.addEdit);
  };

  const editPatientHandler = (patient: Patient) => {
    history.push(
      `${routeNames.patients.addEdit}?OHIPNumber=${patient.OHIPNumber}`,
      patient
    );
  };

  useEffect(() => {
    const getPatientsWrapper = async () => {
      await dispatch(getPatients());
      setIsLoading(false);
    };

    getPatientsWrapper();
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <Typography variant="h2" gutterBottom>
        Patient
      </Typography>
      {isLoading && (
        <div className={classes.loadingText}>
          <CircularProgress size={16} />
          &nbsp;<Typography>Loading...</Typography>
        </div>
      )}
      {!isLoading && (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addPatientHandler}
          >
            Patients
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>OHIP Number</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {patientsData.map((p) => (
                  <TableRow key={p.OHIPNumber}>
                    <TableCell>{p.OHIPNumber}</TableCell>
                    <TableCell>{p.firstName}</TableCell>
                    <TableCell>{p.lastName}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => editPatientHandler(p)}>
                        <CreateIconOutlined />
                      </IconButton>
                      <IconButton onClick={() => dispatch(deletePatient(p))}>
                        <DeleteIconOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};
