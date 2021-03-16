import React from 'react';
import { SDCSection } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCSectionComponent from './SDCSectionComponent';

interface SDCFormBodyProps {
  formResponse: SDCFormResponse;
  body: SDCSection;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}

export default ({
  body,
  formResponse,
  onQuestionAnswerChange,
}: SDCFormBodyProps): JSX.Element => {
  return (
    <>
      {body.sections &&
        body.sections.map((section) => (
          <SDCSectionComponent
            onQuestionAnswerChange={onQuestionAnswerChange}
            key={JSON.stringify(section)}
            section={section}
            formResponse={formResponse}
            nestingLevel={0}
          />
        ))}
    </>
  );
};
