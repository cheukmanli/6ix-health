import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import { SDCQuestion } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import TextInput from '../../../../core/components/TextInput';
import SDCControlledQuestion from './SDCControlledQuestion';

interface SDCSingleSelectOptionProps {
  text: string;
  value?: string;
  responseMode?: string;
  controlledQuestions?: SDCQuestion[];
  formResponse: SDCFormResponse;
  onChangeValue: Function;
}

export default ({
  text,
  value = '',
  responseMode,
  controlledQuestions,
  formResponse,
  onChangeValue,
}: SDCSingleSelectOptionProps): JSX.Element => {
  return (
    <div>
      <FormControlLabel value={text} control={<Radio />} label={text} />
      {responseMode === 'responseText' && (
        <TextInput onChangeValue={onChangeValue} />
      )}
      {controlledQuestions &&
        controlledQuestions.map((controlledQuestion) => (
          <SDCControlledQuestion
            onQuestionAnswerChange={(_, answer) => onChangeValue(answer)}
            key={JSON.stringify(controlledQuestion)}
            enabled={value === text}
            controlledQuestion={controlledQuestion}
            formResponse={formResponse}
          />
        ))}
    </div>
  );
};
