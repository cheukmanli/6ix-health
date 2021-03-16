import React from 'react';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { SDCForm } from '../../../../../domain/sdcForm/SDCForm';
import SDCFormMetadata from './SDCFormMetadata';

const useStyles = makeStyles({
  formTitle: {
    textAlign: 'center',
  },
});

interface SDCFormHeaderProps {
  sdcForm: SDCForm;
}

export default ({ sdcForm }: SDCFormHeaderProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" className={classes.formTitle} gutterBottom>
        {sdcForm.title}
      </Typography>
      <SDCFormMetadata metadata={sdcForm.metadata} />
    </>
  );
};
