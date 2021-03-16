import React, { useRef, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

interface Props {
  delay?: number;
  onQueryComplete(
    data: {
      queryText: string;
      SDCFormIds: string[];
      diagnosticProcedureIds: string[];
    } | null
  ): void;
  className?: string;
  onChange?: (value: string) => void;
}

const useStyles = makeStyles({
  icon: {
    position: 'relative',
    top: '5px',
  },
});

const parseQuery = (queryStr: string) => {
  if (queryStr === null || queryStr === '') return null;
  queryStr.trim();

  // extract diagnostic procedure ids
  const dpIdMatches = queryStr.match(/(dp-id:[^ ]+)/g) ?? [];
  const diagnosticProcedureIds = dpIdMatches.map((match: string) =>
    match.substring(6, match.length)
  );

  // extract form ids
  const formIdMatches = queryStr.match(/(form-id:[^ ]+)/g) ?? [];
  const SDCFormIds = formIdMatches.map((match: string) =>
    match.substring(8, match.length)
  );

  // extract non id related text
  // https://stackoverflow.com/a/49655264
  const combined = [...dpIdMatches, ...formIdMatches];
  const queryText =
    queryStr
      .replace(new RegExp(`\\b(${combined?.join('|') ?? ''})\\b`, 'gi'), ' ')
      .replace(/\s{2,}/g, ' ')
      .trim() ?? '';

  return {
    queryText,
    SDCFormIds,
    diagnosticProcedureIds,
  };
};

export default function SearchBar({
  delay,
  onQueryComplete,
  onChange,
  className,
}: Props): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const didMountRef = useRef(false); // to prevent debounced func being called on initial render

  const debouncedChange = useRef(
    debounce((val: string) => {
      const data = parseQuery(val);
      onQueryComplete(data);
    }, delay)
  );

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
    if (didMountRef.current) {
      debouncedChange.current(value);
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={className}>
      <TextField
        value={value}
        label="Type to search"
        margin="normal"
        variant="outlined"
        fullWidth
        InputProps={{ type: 'search' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
      <InfoOutlinedIcon
        fontSize="small"
        color="primary"
        className={classes.icon}
      />
      &nbsp;
      <Typography variant="caption">
        You can include multiple <strong>&quot;dp-id:abc-123&quot;</strong> to
        search by Diagnostic Procedure IDs and multiple&nbsp;
        <strong>&quot;form-id:abc-123&quot;</strong> to search by SDC Form IDs.
      </Typography>
    </div>
  );
}

SearchBar.defaultProps = {
  className: '',
  delay: 1000,
};
