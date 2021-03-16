import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useState } from 'react';
import FormFiller from '../../../../../domain/formFiller/FormFiller';
import Patient from '../../../../../domain/patient/Patient';

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

type SDCFormAssociatedUsersSelectorProps = {
  patients: Patient[];
  formFillers: FormFiller[];
  onPatientSelect: (patient: Patient) => void;
  onFormFillerSelect: (formFiller: FormFiller) => void;
};

export default ({
  patients,
  formFillers,
  onPatientSelect,
  onFormFillerSelect,
}: SDCFormAssociatedUsersSelectorProps): JSX.Element => {
  const [selectedPatientOHIPNumber, setSelectedPatientOHIPNumber] = useState(
    ''
  );

  const [selectedFormFillerId, setSelectedFormFillerId] = useState('');

  const classes = useStyles();

  const handleSelectedPatientChange = (OHIPNumber: string) => {
    const newPatient = patients.find(
      (patient) => patient.OHIPNumber === OHIPNumber
    );

    if (newPatient) {
      setSelectedPatientOHIPNumber(newPatient.OHIPNumber);
      onPatientSelect(newPatient);
    }
  };
  const handleSelectedFormFillerChange = (formFillerId: string) => {
    const newFormFiller = formFillers.find(
      (formFiller) => formFiller.formFillerId === formFillerId
    );
    if (newFormFiller) {
      setSelectedFormFillerId(newFormFiller.formFillerId);
      onFormFillerSelect(newFormFiller);
    }
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel>Patient</InputLabel>
        <Select
          value={selectedPatientOHIPNumber}
          onChange={(e) =>
            handleSelectedPatientChange(e.target.value as string)
          }
        >
          {patients.map((patient) => (
            <MenuItem
              key={patient.OHIPNumber}
              value={patient.OHIPNumber}
            >{`${patient.firstName} ${patient.lastName} (OHIP Number: ${patient.OHIPNumber})`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Form Filler</InputLabel>
        <Select
          value={selectedFormFillerId}
          onChange={(e) =>
            handleSelectedFormFillerChange(e.target.value as string)
          }
        >
          {formFillers.map((formFiller) => (
            <MenuItem
              key={formFiller.formFillerId}
              value={formFiller.formFillerId}
            >{`${formFiller.firstName} ${formFiller.lastName} (Form Filler ID: ${formFiller.formFillerId})`}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
