import React, { useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
});

interface DatePickerProps {
  suffixText?: string;
  onChangeValue: Function;
}
export default ({
  suffixText,
  onChangeValue,
}: DatePickerProps): JSX.Element => {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  function handleOnChange(date: dayjs.Dayjs | null) {
    onChangeValue(date?.format());
    setSelectedDate(date);
  }

  return (
    <span className={classes.container}>
      <KeyboardDatePicker
        value={selectedDate}
        onChange={(date: dayjs.Dayjs | null) => handleOnChange(date)}
      />
      {suffixText && suffixText}
    </span>
  );
};
