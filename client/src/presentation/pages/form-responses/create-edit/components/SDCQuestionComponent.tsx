import { Card, CardContent, makeStyles } from '@material-ui/core';
import React from 'react';
import { SDCQuestion } from '../../../../../domain/sdcForm/SDCForm';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';
import SDCResponseQuestionComponent from './SDCResponseQuestionComponent';
import SDCSelectQuestionComponent from './SDCSelectQuestionComponent';

const useStyles = makeStyles({
  cardContainer: {
    marginTop: '16px',
    marginBottom: '16px',
    backgroundColor: 'lightskyblue',
  },
});

interface SDCQuestionComponentProps {
  formResponse: SDCFormResponse;
  sdcQuestion: SDCQuestion;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}

export default function SDCQuestionComponent({
  sdcQuestion,
  formResponse,
  onQuestionAnswerChange,
}: SDCQuestionComponentProps): JSX.Element {
  const classes = useStyles();

  return (
    <Card className={classes.cardContainer}>
      <CardContent>
        {sdcQuestion.type === 'ResponseQuestion' ? (
          <SDCResponseQuestionComponent
            formResponse={formResponse}
            question={sdcQuestion}
            questionText={sdcQuestion.question}
            onQuestionAnswerChange={onQuestionAnswerChange}
          />
        ) : (
          <SDCSelectQuestionComponent
            onQuestionAnswerChange={onQuestionAnswerChange}
            question={sdcQuestion}
            formResponse={formResponse}
          />
        )}
        {sdcQuestion.isParentQuestion === 'true' &&
          sdcQuestion.subQuestions.map((subQuestion) => (
            <SDCQuestionComponent
              onQuestionAnswerChange={onQuestionAnswerChange}
              sdcQuestion={subQuestion}
              formResponse={formResponse}
            />
          ))}
      </CardContent>
    </Card>
  );
}
