import { FormGroup } from '@material-ui/core';
import React, { useState } from 'react';
import { SDCSelectOption } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCMultiSelectOption from './SDCMultiSelectOption';

interface SDCMultiSelectQuestionProps {
  formResponse: SDCFormResponse;
  sdcSelectOptions: SDCSelectOption[];
  defaultOptions?: string[];
  onChangeValue: Function;
}
export default ({
  sdcSelectOptions,
  formResponse,
  onChangeValue,
}: SDCMultiSelectQuestionProps): JSX.Element => {
  const initialValues: string[] = [];

  const [selectedValues, updateSelected] = useState(initialValues);

  function pushValue(array: string[], value: string) {
    return [...array, value];
  }

  function popValue(array: string[], value: string) {
    return array.filter((el) => el !== value);
  }

  function mapOptionTextsToIds(optionTexts: string[]) {
    return sdcSelectOptions
      .filter((option) => optionTexts.includes(option.text))
      .map((option) => option.optionId);
  }

  function handleFormChange(e: any) {
    const value = e.target.value as string;
    const newSelected = selectedValues.includes(value)
      ? popValue(selectedValues, value)
      : pushValue(selectedValues, value);
    const selectedIds = mapOptionTextsToIds(newSelected);
    onChangeValue(selectedIds);
    updateSelected(newSelected);
  }

  return (
    <FormGroup onChange={(e) => handleFormChange(e)}>
      {sdcSelectOptions.map((option) => (
        <SDCMultiSelectOption
          onChangeValue={onChangeValue}
          key={option.text}
          text={option.text}
          formResponse={formResponse}
          responseMode={option.responseMode}
          controlledQuestions={option.controlledQuestions}
        />
      ))}
    </FormGroup>
  );
};
