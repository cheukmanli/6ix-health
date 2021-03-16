import RadioGroup from '@material-ui/core/RadioGroup';
import React, { useEffect, useState } from 'react';
import {
  SDCQuestion,
  SDCSelectOption,
} from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCSingleSelectOption from './SDCSingleSelectOption';

interface SDCSingleSelectQuestionProps {
  formResponse: SDCFormResponse;
  question: SDCQuestion;
  sdcSelectOptions: SDCSelectOption[];
  defaultOption?: string;
  onChangeValue: Function;
}

export default ({
  sdcSelectOptions,
  formResponse,
  defaultOption,
  onChangeValue,
}: SDCSingleSelectQuestionProps): JSX.Element => {
  const [value, updateValue] = useState('');

  useEffect(() => {
    if (defaultOption && value === '') {
      updateValue(defaultOption);
    }
  }, [defaultOption, value]);

  function handleChange(e: any) {
    const selectedOptionId = sdcSelectOptions.find(
      (option) => option.text === e.target.value
    )?.optionId;
    onChangeValue(selectedOptionId);
    updateValue(e.target.value);
  }
  return (
    <div>
      <RadioGroup onChange={(e) => handleChange(e)} value={value}>
        {sdcSelectOptions.map((option) => {
          return (
            <SDCSingleSelectOption
              onChangeValue={onChangeValue}
              key={option.optionId}
              text={option.text}
              value={value}
              responseMode={option.responseMode}
              formResponse={formResponse}
              controlledQuestions={option.controlledQuestions}
            />
          );
        })}
      </RadioGroup>
    </div>
  );
};
