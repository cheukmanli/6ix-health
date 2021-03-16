import React from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

interface Props {
  className?: string;
  onChange(data: {
    SDCFormIds: string[];
    diagnosticProcedureIds: string[];
    dates: string[];
    times: string[];
    queryText: string;
  }): void;
}

const useStyles = makeStyles({
  icon: {
    position: 'relative',
    top: '5px',
  },
  list: { margin: 0 },
});

const parseQuery = (queryText: string) => {
  if (queryText === null || queryText === '')
    return {
      SDCFormIds: [],
      diagnosticProcedureIds: [],
      dates: [],
      times: [],
      queryText: '',
    };

  queryText.trim();

  // extract diagnostic procedure ids
  const dpIdMatches = queryText.match(/(dp-id:[^ ]+)/g) ?? [];
  const diagnosticProcedureIds = dpIdMatches.map((match: string) =>
    match.substring(6, match.length)
  );

  // extract form ids
  const formIdMatches = queryText.match(/(form-id:[^ ]+)/g) ?? [];
  const SDCFormIds = formIdMatches.map((match: string) =>
    match.substring(8, match.length)
  );

  // extract dates
  const dateMatches = queryText.match(/(date:[^ ]+)/g) ?? [];
  const dates = dateMatches.map((match: string) =>
    match.substring(5, match.length)
  );

  // extract times
  const timeMatches = queryText.match(/(time:[^ ]+)/g) ?? [];
  const times = timeMatches.map((match: string) =>
    match.substring(5, match.length)
  );

  return {
    SDCFormIds,
    diagnosticProcedureIds,
    dates,
    times,
    queryText,
  };
};

export default function SearchBar({ onChange, className }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <div className={className}>
      <TextField
        label="Type to Filter"
        margin="normal"
        variant="outlined"
        fullWidth
        InputProps={{ type: 'search' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const parsed = parseQuery(e.target.value);
          onChange(parsed);
        }}
      />
      <InfoOutlinedIcon
        fontSize="small"
        color="primary"
        className={classes.icon}
      />
      &nbsp;
      <Typography variant="caption">You can include multiple:</Typography>
      <ul className={classes.list}>
        <Typography variant="caption" component="li">
          <strong>dp-id:abc-123</strong> to filter by Diagnostic Procedure IDs.
        </Typography>
        <Typography variant="caption" component="li">
          <strong>form-id:abc-123</strong> to filter by SDC Form IDs.
        </Typography>
        <Typography variant="caption" component="li">
          <strong>time:04-32</strong> to filter by time.
        </Typography>
        <Typography variant="caption" component="li">
          <strong>date:2012-12-06</strong> to filter by date.
        </Typography>
      </ul>
    </div>
  );
}

SearchBar.defaultProps = {
  className: '',
};
