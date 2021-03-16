import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import clsx from 'clsx';
import { ResponseQuestion } from '../../../../../domain/sdcForm/SDCForm';
import DatePicker from '../../../../core/components/DatePicker';
import NumberInput from '../../../../core/components/NumberInput';
import TextInput from '../../../../core/components/TextInput';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';

const useStyles = makeStyles({
  questionContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    marginRight: 16,
  },
});

interface SDCResponseQuestionComponentProps {
  formResponse: SDCFormResponse;
  question: ResponseQuestion;
  questionText: string;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}
export default ({
  formResponse,
  question,
  questionText = question.question,
  onQuestionAnswerChange,
}: SDCResponseQuestionComponentProps): JSX.Element => {
  const classes = useStyles();

  let renderedComponent;

  function handleOnChangeValue(value: string | string[]) {
    onQuestionAnswerChange(question.questionId, value);
  }

  if (formResponse) {
    let defaultAnswer;
    (Object.keys(formResponse.answers) as Array<string>).forEach((key) => {
      if (key === question.questionId) {
        defaultAnswer = formResponse.answers[key];
      }
    });

    if (question.responseType === 'string') {
      renderedComponent = (
        <div>
          {questionText}(Question ID {question.questionId})
          <span className={clsx(questionText && classes.spacer)} />
          <TextInput
            onChangeValue={handleOnChangeValue}
            defaultValue={defaultAnswer}
            suffixText={question.responseSuffix}
          />
        </div>
      );
    } else if (
      question.responseType === 'decimal' ||
      question.responseType === 'integer'
    ) {
      renderedComponent = (
        <div>
          {questionText}
          <span className={clsx(questionText && classes.spacer)} />
          <NumberInput
            onChangeValue={handleOnChangeValue}
            type={question.responseType}
            defaultAnswer={defaultAnswer}
            suffixText={question.responseSuffix}
          />
        </div>
      );
    }
    // date type
    else {
      renderedComponent = (
        <div className={classes.questionContainer}>
          {questionText}
          <span className={clsx(questionText && classes.spacer)} />
          <DatePicker
            onChangeValue={handleOnChangeValue}
            suffixText={question.responseSuffix}
          />
        </div>
      );
    }

    return renderedComponent;
  }
  return <div />;
};
