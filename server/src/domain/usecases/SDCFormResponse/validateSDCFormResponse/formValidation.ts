import SDCFormResponse, {
  QuestionAnswersMap,
  SDCAnswer,
} from '../../../../domain/entities/SDCFormResponse';
import SDCForm, {
  ResponseQuestion,
  SDCQuestion,
  SDCSection,
  SelectQuestion,
} from '../../../../domain/entities/SDCForm';
import {
  SDCFormResponseValidationResult,
  ValidationErrors,
} from '../../../../domain/entities/SDCFormResponseValidationResult';

abstract class ISDCFormResponseValidator {
  static validateSDCFormResponse: (
    sdcFormResponse: SDCFormResponse,
    sdcForm: SDCForm
  ) => SDCFormResponseValidationResult;
}

export class SDCFormResponseValidatorUtility extends ISDCFormResponseValidator {
  /**
   * Validates an answer with a given response question.
   * @param responseQuestion
   * @param answer
   * @returns {null | string} null if there are no errors, otherwise the error message.
   */
  private static validateResponseQuestion = (
    responseQuestion: ResponseQuestion,
    answer: SDCAnswer
  ): null | string => {
    let ret: null | string = null;

    // The answer should not be an array of strings for a response question.
    if (Array.isArray(answer)) {
      return 'Cannot send an array for answers for a response question.';
    }

    if (responseQuestion.responseType == 'integer') {
      // Should have validation for max and min int values.
      // This if statement checks if the answer is not a valid number.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isNaN(answer as any)) {
        ret = 'This answer must be a number.';
      } else {
        const numAns = Number(answer),
          { maxIntValue, minIntValue } = responseQuestion;
        // Out of bounds
        if (numAns > maxIntValue || numAns < minIntValue) {
          ret =
            'This number must be between ' +
            minIntValue +
            ' and ' +
            maxIntValue +
            '.';
        }
      }
    } else if (responseQuestion.responseType == 'string') {
      // Should have validation for max and min length of string.
      const { minLength, maxLength } = responseQuestion;

      // Out of bounds
      if (answer.length > maxLength || answer.length < minLength) {
        ret =
          'This field must be between ' +
          minLength +
          ' and ' +
          maxLength +
          ' characters long.';
      }
    } else if (responseQuestion.responseType == 'decimal') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isNaN(answer as any)) {
        ret = 'This answer must be a number.';
      }
    }

    return ret;
  };

  private static processSelectQuestion = (
    selectQuestion: SelectQuestion,
    answers: QuestionAnswersMap
  ): ValidationErrors => {
    let ret: ValidationErrors = {};

    if (selectQuestion.isRequired) {
      const { questionId } = selectQuestion;

      if (!(questionId in answers)) {
        ret = { ...ret, [questionId]: 'This field is required.' };
      } else {
        // That means that the answer did pick an option.
        // Now, we must recurse on any controlledQuestions if they exist on the
        // option that was chosen.

        const answerToQuestion = answers[questionId];

        if (Array.isArray(answerToQuestion)) {
          const chosenOptions = selectQuestion.options.filter((o) => {
            return answerToQuestion.includes(o.optionId);
          });

          if (chosenOptions && chosenOptions.length > 0) {
            const allErrors = chosenOptions.reduce(
              (acc: ValidationErrors, currOption) => {
                if (
                  currOption.controlledQuestions &&
                  currOption.controlledQuestions.length > 0
                ) {
                  const errors = currOption.controlledQuestions.reduce(
                    (acc: ValidationErrors, currQuestion) => {
                      const data = SDCFormResponseValidatorUtility.processQuestion(
                        currQuestion,
                        answers
                      );
                      return { ...acc, ...data };
                    },
                    {}
                  );

                  return { ...acc, ...errors };
                }

                return acc;
              },
              {}
            );

            ret = { ...ret, ...allErrors };
          }
        } else {
          const option = selectQuestion.options.find(
            (o) => o.optionId == answerToQuestion
          );

          if (
            option &&
            option.controlledQuestions &&
            option.controlledQuestions.length > 0
          ) {
            const errors = option.controlledQuestions.reduce(
              (acc: ValidationErrors, currQuestion) => {
                const data = SDCFormResponseValidatorUtility.processQuestion(
                  currQuestion,
                  answers
                );
                return { ...acc, ...data };
              },
              {}
            );

            ret = { ...ret, ...errors };
          }
        }
      }

      ret = {
        ...ret,
        ...SDCFormResponseValidatorUtility.processParentQuestion(
          selectQuestion,
          answers
        ),
      };
    }

    return ret;
  };

  private static processResponseQuestion = (
    responseQuestion: ResponseQuestion,
    answers: QuestionAnswersMap
  ): ValidationErrors => {
    let ret: ValidationErrors = {};

    if (responseQuestion.isRequired) {
      const { questionId } = responseQuestion;

      // If the question is required and there is no answer for it
      if (!(questionId in answers)) {
        ret = { ...ret, [questionId]: 'This field is required.' };
      } else {
        const validation = SDCFormResponseValidatorUtility.validateResponseQuestion(
          responseQuestion,
          answers[questionId]
        );

        if (typeof validation === 'string') {
          ret = { ...ret, [questionId]: validation };
        }
      }

      // Do logic for the subQuestions if this is a parent question.
      ret = {
        ...ret,
        ...SDCFormResponseValidatorUtility.processParentQuestion(
          responseQuestion,
          answers
        ),
      };
    }

    return ret;
  };

  /**
   * Will process the subQuestions only if the question inputted is a parent question.
   * @param question
   * @param answers
   */
  private static processParentQuestion = (
    question: SDCQuestion,
    answers: QuestionAnswersMap
  ): ValidationErrors => {
    let ret: ValidationErrors = {};

    if (question.isParentQuestion === 'true') {
      const { subQuestions } = question;

      const validationMap = subQuestions.reduce(
        (acc: ValidationErrors, currQuestion) => {
          const data = SDCFormResponseValidatorUtility.processQuestion(
            currQuestion,
            answers
          );
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...ret, ...validationMap };
    }

    return ret;
  };

  /**
   * Processes a Question to produce its resulting error messages (if there are any).
   * @param answers The answers
   * @param question The question to process
   */
  private static processQuestion = (
    question: SDCQuestion,
    answers: QuestionAnswersMap
  ): ValidationErrors => {
    let ret: ValidationErrors = {};

    if (question.type == 'ResponseQuestion') {
      ret = {
        ...ret,
        ...SDCFormResponseValidatorUtility.processResponseQuestion(
          question,
          answers
        ),
      };
    } else {
      ret = {
        ...ret,
        ...SDCFormResponseValidatorUtility.processSelectQuestion(
          question,
          answers
        ),
      };
    }

    return ret;
  };

  private static processSection = (
    section: SDCSection,
    answers: QuestionAnswersMap
  ): ValidationErrors => {
    let ret: ValidationErrors = {};

    if (section.questions && section.questions.length > 0) {
      const errors = section.questions.reduce(
        (acc: ValidationErrors, currQuestion) => {
          const info = SDCFormResponseValidatorUtility.processQuestion(
            currQuestion,
            answers
          );
          return { ...acc, ...info };
        },
        {}
      );

      ret = { ...ret, ...errors };
    }

    if (section.sections && section.sections.length > 0) {
      // For each section, process the questions.
      const sectionErrors = section.sections.reduce(
        (sectionAcc: ValidationErrors, currSection) => {
          if (currSection.questions && currSection.questions.length > 0) {
            const errors = currSection.questions.reduce(
              (acc: ValidationErrors, currQuestion) => {
                const info = SDCFormResponseValidatorUtility.processQuestion(
                  currQuestion,
                  answers
                );
                return { ...acc, ...info };
              },
              {}
            );

            return { ...sectionAcc, ...errors };
          }

          return sectionAcc;
        },
        {}
      );

      ret = { ...ret, ...sectionErrors };
    }

    return ret;
  };

  private static generateErrorsMap = (
    sdcFormResponse: Omit<
      SDCFormResponse,
      'formFillerId' | 'OHIPNumber' | 'lastModified'
    >,
    sdcForm: SDCForm
  ): ValidationErrors => {
    // At the top level of the SDCForm, we must recursively dive into sections
    // and questions.

    const errors = SDCFormResponseValidatorUtility.processSection(
      sdcForm.body,
      sdcFormResponse.answers
    );

    return errors;
  };

  static validateSDCFormResponse = (
    sdcFormResponse: Omit<
      SDCFormResponse,
      'formFillerId' | 'OHIPNumber' | 'lastModified'
    >,
    sdcForm: SDCForm
  ): SDCFormResponseValidationResult => {
    let ret: SDCFormResponseValidationResult = { status: 'OK' };

    if (
      sdcFormResponse.diagnosticProcedureId !== sdcForm.diagnosticProcedureId
    ) {
      return {
        status: 'FAILURE_ON_MATCHING_FORM_WITH_RES',
        message: 'The diagnosticProcedureIds do not match.',
      };
    } else if (sdcFormResponse.SDCFormId !== sdcForm.SDCFormId) {
      return {
        status: 'FAILURE_ON_MATCHING_FORM_WITH_RES',
        message: 'The SDCFormIds do not match.',
      };
    }

    const sdcfrDefensiveCopy: Omit<
      SDCFormResponse,
      'formFillerId' | 'OHIPNumber' | 'lastModified'
    > = { ...sdcFormResponse };

    const errors = SDCFormResponseValidatorUtility.generateErrorsMap(
      sdcfrDefensiveCopy,
      sdcForm
    );

    if (Object.keys(errors).length > 0) {
      ret = { status: 'FAILED_QUESTIONS', errors };
    }

    return ret;
  };
}
