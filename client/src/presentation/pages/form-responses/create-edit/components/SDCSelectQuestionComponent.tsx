import { FormControl, FormLabel } from '@material-ui/core';
import React from 'react';
import { SelectQuestion } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCMultiSelectQuestion from './SDCMultiSelectQuestion';
import SDCSingleSelectQuestion from './SDCSingleSelectQuestion';

interface SDCSelectQuestionComponentProps {
  formResponse: SDCFormResponse;
  question: SelectQuestion;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}
export default ({
  question,
  formResponse,
  onQuestionAnswerChange,
}: SDCSelectQuestionComponentProps): JSX.Element => {
  const defaultOption: string[] = [];

  if (formResponse && formResponse.answers) {
    const defaultOptionId = formResponse.answers[question.questionId];
    if (defaultOptionId) {
      question.options.forEach((option) => {
        if (option.optionId === defaultOptionId) {
          defaultOption.push(option.text);
        }
      });
    }
  }

  function handleonQuestionAnswerChange(value: string | string[]) {
    onQuestionAnswerChange(question.questionId, value);
  }

  return (
    <FormControl>
      <FormLabel>{`${question.question}(Question ID ${question.questionId})`}</FormLabel>
      {question.maxSelections === 1 ? (
        <SDCSingleSelectQuestion
          onChangeValue={handleonQuestionAnswerChange}
          sdcSelectOptions={question.options}
          question={question}
          formResponse={formResponse}
          defaultOption={defaultOption[0]}
        />
      ) : (
        <SDCMultiSelectQuestion
          onChangeValue={handleonQuestionAnswerChange}
          sdcSelectOptions={question.options}
          formResponse={formResponse}
        />
      )}
    </FormControl>
  );
};
