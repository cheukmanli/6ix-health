import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import CreateIconOutlined from '@material-ui/icons/CreateOutlined';
import DeleteIconOutlined from '@material-ui/icons/DeleteOutlined';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import { presentationEnums } from '../../core/enums';
import FormFiller from '../../../domain/formFiller/FormFiller';
import { RootState } from '../../store/rootReducer';
import {
  deleteFormFiller,
  getAllFormFillersDataArray,
  getFormFillers,
} from '../../store/formFiller';

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

  const { formFillersData } = useSelector((state: RootState) => ({
    formFillersData: getAllFormFillersDataArray(state),
  }));

  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const addFormFillerHandler = () => {
    history.push(routeNames.formFillers.addEdit);
  };

  const editFormFillerHandler = (formFiller: FormFiller) => {
    history.push(
      `${routeNames.formFillers.addEdit}?formFillerId=${formFiller.formFillerId}`,
      formFiller
    );
  };

  useEffect(() => {
    const getformFillersWrapper = async () => {
      await dispatch(getFormFillers());
      setIsLoading(false);
    };

    getformFillersWrapper();
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <Typography variant="h2" gutterBottom>
        Form Fillers
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
            onClick={addFormFillerHandler}
          >
            Form Filler
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Form Filler ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {formFillersData.map((f) => (
                  <TableRow key={f.formFillerId}>
                    <TableCell>{f.formFillerId}</TableCell>
                    <TableCell>{f.firstName}</TableCell>
                    <TableCell>{f.lastName}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => editFormFillerHandler(f)}>
                        <CreateIconOutlined />
                      </IconButton>
                      <IconButton onClick={() => dispatch(deleteFormFiller(f))}>
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
