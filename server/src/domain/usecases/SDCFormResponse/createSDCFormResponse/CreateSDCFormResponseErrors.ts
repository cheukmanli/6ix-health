import { UseCaseError } from 'domain/definition/UseCaseError';
import { FailureOnQuestionsResult } from 'domain/entities/SDCFormResponseValidationResult';

export class CreateSDCFormResponseInvalidRequest extends UseCaseError {
  constructor() {
    super(`Invalid request, please try again`);
  }
}

export class CreateSDCFormResponseValidationFailedRequest extends UseCaseError {
  failureOnQuestionResults: FailureOnQuestionsResult;
  constructor(failureOnQuestionResults: FailureOnQuestionsResult) {
    super('');
    this.failureOnQuestionResults = failureOnQuestionResults;
  }
}
