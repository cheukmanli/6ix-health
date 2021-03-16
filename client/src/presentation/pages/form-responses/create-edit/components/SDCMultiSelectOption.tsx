import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useState } from 'react';
import { SDCQuestion } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import TextInput from '../../../../core/components/TextInput';
import SDCControlledQuestion from './SDCControlledQuestion';

interface SDCMultiSelectOptionProps {
  text: string;
  responseMode?: string;
  formResponse: SDCFormResponse;
  controlledQuestions?: SDCQuestion[];
  onChangeValue: Function;
}

export default ({
  text,
  responseMode,
  controlledQuestions,
  formResponse,
  onChangeValue,
}: SDCMultiSelectOptionProps): JSX.Element => {
  const [showChildren, toggle] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOnChange(e: any) {
    if (e.target.value === text) {
      toggle(!showChildren);
    }
  }

  return (
    <div>
      <FormControlLabel
        value={text}
        control={<Checkbox />}
        label={text}
        onChange={(e) => handleOnChange(e)}
      />
      {responseMode === 'responseText' && (
        <TextInput onChangeValue={onChangeValue} />
      )}
      {controlledQuestions &&
        controlledQuestions.map((controlledQuestion) => (
          <SDCControlledQuestion
            onQuestionAnswerChange={(_, answer) => onChangeValue(answer)}
            key={JSON.stringify(controlledQuestion)}
            enabled={showChildren}
            controlledQuestion={controlledQuestion}
            formResponse={formResponse}
          />
        ))}
    </div>
  );
};
