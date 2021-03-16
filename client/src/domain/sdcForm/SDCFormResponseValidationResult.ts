export type SDCFormResponseValidationResult =
  | SuccessResult
  | FailureOnQuestionsResult
  | FailureFormMismatch;

type SuccessResult = {
  status: 'OK';
};

export type ValidationErrors = { [questionId: string]: string };

/** Question ID to the message generated */
export type FailureOnQuestionsResult = {
  status: 'FAILED_QUESTIONS';
  /**
   * This will be a map of questionId to some type of error message. These
   *  errors are specific to questions.
   */
  errors: ValidationErrors;
};

/**
 * This type of error is thrown if the sdcFormId or diagnosticProcedureId
 *  of the SDCFormResponse do not match the SDCForm's sdcFormId and diagnosticProcedureId.
 */
type FailureFormMismatch = {
  status: 'FAILURE_ON_MATCHING_FORM_WITH_RES';
  message: string;
};
