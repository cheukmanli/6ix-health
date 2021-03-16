import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import { SDCFormResponse } from '../../../../domain/sdcFormResponse/SDCFormResponse';

const useStyles = makeStyles({
  container: { margin: '8px' },
  lastModified: { marginTop: '16px' },
});

type SDCFormListItemProps = {
  response: SDCFormResponse;
};

const SDCFormResponseListItem = ({ response }: SDCFormListItemProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <CardContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>SDC Form ID:</strong> {response.sdcFormId}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Form Filler ID:</strong> {response.formFillerId}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Diagnostic Procedure ID:</strong>&nbsp;
          {response.diagnosticProcedureId}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Patient OHIP Number:</strong> {response.OHIPNumber}
        </Typography>

        <Typography
          className={classes.lastModified}
          align="right"
          variant="body2"
          color="textSecondary"
          gutterBottom
        >
          Last Modified:&nbsp;
          {dayjs(response.lastModified).format('YYYY-MM-DD, HH:mm')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SDCFormResponseListItem;
