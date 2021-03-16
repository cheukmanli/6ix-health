import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import React from 'react';
import { SDCQuestion } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCQuestionComponent from './SDCQuestionComponent';

const useStyles = makeStyles({
  subQuestionCard: {
    marginTop: '16px',
    marginBottom: '16px',
    marginLeft: '32px',
    padding: '8px',
    backgroundColor: '#a7dbfb',
  },
});

interface SDCControlledQuestionProps {
  formResponse: SDCFormResponse;
  enabled: boolean;
  controlledQuestion: SDCQuestion;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}
export default ({
  enabled,
  controlledQuestion,
  formResponse,
  onQuestionAnswerChange,
}: SDCControlledQuestionProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      {enabled && (
        <Card className={classes.subQuestionCard}>
          {' '}
          <SDCQuestionComponent
            onQuestionAnswerChange={onQuestionAnswerChange}
            sdcQuestion={controlledQuestion}
            formResponse={formResponse}
          />
        </Card>
      )}
    </>
  );
};
