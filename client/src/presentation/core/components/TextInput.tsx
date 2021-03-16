import Input from '@material-ui/core/Input/Input';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import React from 'react';

interface TextInputProps {
  suffixText?: string;
  defaultValue?: string;
  onChangeValue: Function;
}

export default ({
  suffixText,
  defaultValue,
  onChangeValue,
}: TextInputProps): JSX.Element => {
  return (
    <Input
      onChange={(e) => onChangeValue(e.target.value)}
      defaultValue={defaultValue}
      endAdornment={
        suffixText ? (
          <InputAdornment position="end">{suffixText}</InputAdornment>
        ) : undefined
      }
    />
  );
};
