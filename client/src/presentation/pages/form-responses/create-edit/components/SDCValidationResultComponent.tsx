import Typography from '@material-ui/core/Typography';
import React from 'react';
import { FailureOnQuestionsResult } from '../../../../../domain/sdcForm/SDCFormResponseValidationResult';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';

interface SDCValidationResultComponentProps {
  validationResultOrResponse: SDCFormResponse | FailureOnQuestionsResult;
}

export default ({
  validationResultOrResponse,
}: SDCValidationResultComponentProps): any => {
  if (validationResultOrResponse instanceof SDCFormResponse) {
    return <Typography>Success</Typography>;
  }

  return (
    <>
      {Object.entries(
        (validationResultOrResponse as FailureOnQuestionsResult).errors
      ).map((foo) => {
        const [questionId, message] = foo;
        return (
          <Typography color="error">
            {questionId}: {message}
          </Typography>
        );
      })}
    </>
  );
};
