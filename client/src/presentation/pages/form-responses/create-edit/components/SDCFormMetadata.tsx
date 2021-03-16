import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SDCFormMetaData } from '../../../../../domain/sdcForm/SDCForm';

const useStyles = makeStyles({
  metadataLabel: {
    fontWeight: 'bold',
  },
});

interface SDCFormMetadataProps {
  metadata: Partial<SDCFormMetaData>;
}

export default ({ metadata }: SDCFormMetadataProps): JSX.Element => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {Object.entries(metadata).map(
            ([label, value]) =>
              value !== undefined &&
              value !== '' && (
                <TableRow key={label}>
                  <TableCell className={classes.metadataLabel}>
                    {label}
                  </TableCell>
                  <TableCell>{value.toString()}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
