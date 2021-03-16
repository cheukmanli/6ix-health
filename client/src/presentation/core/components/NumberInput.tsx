import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import React from 'react';

interface NumberInputProps {
  suffixText?: string;
  defaultAnswer?: string;
  type: 'decimal' | 'integer';
  onChangeValue: Function;
}

export default ({
  suffixText,
  type,
  defaultAnswer,
  onChangeValue,
}: NumberInputProps): JSX.Element => {
  return (
    <Input
      onChange={(e) => onChangeValue(e.target.value)}
      defaultValue={defaultAnswer}
      type="number"
      inputProps={{ step: type === 'decimal' ? 'any' : 1 }}
      endAdornment={
        suffixText ? (
          <InputAdornment position="end">{suffixText}</InputAdornment>
        ) : undefined
      }
    />
  );
};
