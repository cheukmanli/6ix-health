import { Typography } from '@material-ui/core';
import React from 'react';
import { SDCFormFooter } from '../../../../../domain/sdcForm/SDCForm';

interface SDCFormFooterProps {
  sdcFooter: SDCFormFooter;
}

export default ({ sdcFooter }: SDCFormFooterProps): JSX.Element => {
  return (
    <>
      {Object.values(sdcFooter).map((value) => (
        <Typography key={value} variant="h6" gutterBottom>
          {value}
        </Typography>
      ))}
    </>
  );
};
