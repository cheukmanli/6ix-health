import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  deleteSDCForm,
  getAllSDCForms,
  getAllSDCFormsArray,
  querySDCForms,
  getAllSearchedSDCFormsArray,
  addSDCForm,
} from '../../store/sdcForm';
import SDCFormListItem from './components/SDCFormListItem';
import SearchBar from './components/SearchBar';
import { RootState } from '../../store/rootReducer';
import { SDCForm } from '../../../domain/sdcForm/SDCForm';

const useStyles = makeStyles({
  container: {
    margin: '0px 8px',
  },
  searchBar: {
    margin: '16px 8px',
  },
  message: {
    padding: '20px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default (): JSX.Element => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { SDCForms, searchedSDCForms, isSearching, searchError } = useSelector(
    (state: RootState) => ({
      SDCForms: getAllSDCFormsArray(state),
      searchedSDCForms: getAllSearchedSDCFormsArray(state),
      isSearching: state.sdc.isSearching,
      searchError: state.sdc.searchError,
    })
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllSDCFormsWrapper = async () => {
      await dispatch(getAllSDCForms());
      setIsLoading(false);
    };

    getAllSDCFormsWrapper();
  }, [dispatch]);

  const { userType } = useSelector((state: RootState) => ({
    userType: state.user.userType,
  }));

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUploadNewFormPressed = () => {
    if (inputRef.current != null) inputRef.current.click();
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files && event.target.files[0]) || null;

    if (file) {
      dispatch(addSDCForm(file));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetInput = (event: any) => {
    // eslint-disable-next-line no-param-reassign
    event.target.value = null;
  };

  const formList = (forms: SDCForm[]) => (
    <>
      {forms.length === 0 && (
        <Typography className={classes.message}>No Forms Found.</Typography>
      )}
      {userType === 'formManager' && (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onUploadNewFormPressed}
          >
            SDC Form
          </Button>
          <input
            accept="application/xml"
            type="file"
            hidden
            ref={inputRef}
            onChange={onFileSelected}
            onClick={resetInput}
          />
        </>
      )}

      {forms.map((form: SDCForm) => (
        <SDCFormListItem
          key={form.SDCFormId}
          {...{
            form,
            onDeleteSDCForm: (sdcForm) => dispatch(deleteSDCForm(sdcForm)),
          }}
        />
      ))}
    </>
  );

  const renderSearch = () => {
    if (searchError) {
      return (
        <Typography className={classes.message}>Search Failed.</Typography>
      );
    }

    if (isSearching || !searchedSDCForms) {
      return (
        <div className={classes.message}>
          <CircularProgress size={16} />
          &nbsp;<Typography>Searching...</Typography>
        </div>
      );
    }

    return formList(searchedSDCForms);
  };

  const renderForms = () => {
    if (isLoading) {
      return (
        <div className={classes.message}>
          <CircularProgress size={16} />
          &nbsp;<Typography>Loading Forms...</Typography>
        </div>
      );
    }
    return formList(SDCForms);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h2" gutterBottom>
        Forms
      </Typography>

      <SearchBar
        className={classes.searchBar}
        onChange={(val) => setSearchTerm(val)}
        onQueryComplete={(data) => dispatch(querySDCForms(data))}
      />

      {searchTerm ? renderSearch() : renderForms()}
    </div>
  );
};
