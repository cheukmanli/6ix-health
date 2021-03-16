import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import {
  getAllSDCFormResponses,
  getIsLoading,
  getAllSDCFormResponsesArray,
} from '../../store/sdcFormResponse';
import { RootState } from '../../store/rootReducer';
import { SDCFormResponse } from '../../../domain/sdcFormResponse/SDCFormResponse';
import SDCFormResponseListItem from './components/SDCFormResponseListItem';
import SearchBar from './components/SearchBar';

const SORT_BY: {
  [key: string]: string;
} = {
  lastModified: 'Last Modified',
  SDCFormId: 'SDC Form ID',
  OHIPNumber: 'OHIP Number',
  diagnosticProcedureId: 'Diagnostic Procedure Id',
  formFillerId: 'Form Filler Id',
};

const useStyles = makeStyles({
  container: {
    margin: '0px 8px',
  },
  searchBar: {
    margin: '16px 8px',
  },
  sortContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '15px 8px',
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
  const [sortBy, setSortBy] = useState(SORT_BY.lastModified);

  const [searchText, setSearchText] = useState('');
  const [formIdsFilters, setFormIdsFilters] = useState<string[]>([]);
  const [dpIdsFilters, setDpIdsFilters] = useState<string[]>([]);
  const [dateFilters, setDateFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);

  const { SDCFormResponses, isLoading } = useSelector((state: RootState) => ({
    SDCFormResponses: getAllSDCFormResponsesArray(state),
    isLoading: getIsLoading(state),
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    async function effect() {
      await dispatch(getAllSDCFormResponses());
    }
    effect();
  }, [dispatch]);

  const filterFn = (response: SDCFormResponse) => {
    return (
      dateFilters.includes(dayjs(response.lastModified).format('YYYY-MM-DD')) ||
      timeFilters.includes(dayjs(response.lastModified).format('HH:mm')) ||
      formIdsFilters.includes(response.sdcFormId) ||
      dpIdsFilters.includes(response.diagnosticProcedureId)
    );
  };

  const sortFn = (a: SDCFormResponse, b: SDCFormResponse) => {
    const dateA = dayjs(a.lastModified);
    const dateB = dayjs(b.lastModified);
    switch (sortBy) {
      case SORT_BY.lastModified:
        if (dateB.isBefore(dateA)) return -1;
        if (dateA.isBefore(dateB)) return 1;
        return 0;

      case SORT_BY.SDCFormId:
        return a.sdcFormId
          .toLowerCase()
          .localeCompare(b.sdcFormId.toLowerCase());

      case SORT_BY.OHIPNumber:
        return a.OHIPNumber.toLowerCase().localeCompare(
          b.OHIPNumber.toLowerCase()
        );

      case SORT_BY.diagnosticProcedureId:
        return a.diagnosticProcedureId
          .toLowerCase()
          .localeCompare(b.diagnosticProcedureId.toLowerCase());

      case SORT_BY.formFillerId:
        return a.formFillerId
          .toLowerCase()
          .localeCompare(b.formFillerId.toLowerCase());

      default:
        return 0;
    }
  };

  let responses;
  if (searchText) {
    responses = SDCFormResponses.slice().filter(filterFn).sort(sortFn);
  } else {
    responses = SDCFormResponses.slice().sort(sortFn);
  }

  return (
    <div className={classes.container}>
      <Typography variant="h2" gutterBottom>
        Forms Responses
      </Typography>

      <SearchBar
        onChange={(criteria) => {
          setDateFilters(criteria.dates);
          setDpIdsFilters(criteria.diagnosticProcedureIds);
          setFormIdsFilters(criteria.SDCFormIds);
          setTimeFilters(criteria.times);
          setSearchText(criteria.queryText);
        }}
      />

      <div className={classes.sortContainer}>
        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as string)}
          >
            {Object.keys(SORT_BY).map((key: string) => (
              <MenuItem key={key} value={SORT_BY[key]}>
                {SORT_BY[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {isLoading && (
        <div className={classes.message}>
          <CircularProgress size={16} />
          &nbsp;<Typography>Loading Forms...</Typography>
        </div>
      )}

      {!isLoading && responses.length === 0 && (
        <Typography className={classes.message}>
          No Responses Found...
        </Typography>
      )}

      {responses.map((response: SDCFormResponse) => (
        <SDCFormResponseListItem
          key={`${response.sdcFormId}-${response.lastModified}-${response.diagnosticProcedureId}-${response.OHIPNumber}`}
          {...{
            response,
          }}
        />
      ))}
    </div>
  );
};
