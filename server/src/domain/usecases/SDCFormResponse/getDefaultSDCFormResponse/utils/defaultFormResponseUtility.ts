import take from 'lodash/take';
import difference from 'lodash/difference';

import SDCForm, {
  SelectQuestion,
  ResponseQuestion,
  SDCQuestion,
  SDCSection,
} from 'domain/entities/SDCForm';
import SDCFormResponse, {
  SelectQuestionAnswer,
  QuestionAnswersMap,
} from 'domain/entities/SDCFormResponse';
abstract class ISDCFormResponseUtility {
  static generateInitialSDCFormResponse: (
    sdcForm: SDCForm
  ) => Omit<SDCFormResponse, 'formFillerId' | 'lastModified' | 'OHIPNumber'>;
}

export class SDCFormResponseUtility extends ISDCFormResponseUtility {
  private static extractSDCFormProperties = (
    sdcForm: SDCForm
  ): { SDCFormId: string; diagnosticProcedureId: string } => {
    return {
      SDCFormId: sdcForm.SDCFormId,
      diagnosticProcedureId: sdcForm.diagnosticProcedureId,
    };
  };

  /**
   * Returns an initial value for a response question.
   * @param responseQuestion
   */
  private static getResponseAnswersWithoutParent = (
    responseQuestion: ResponseQuestion
  ): QuestionAnswersMap => {
    const { questionId } = responseQuestion;
    const ret: QuestionAnswersMap = {};

    if (responseQuestion.defaultValue !== '') {
      ret[questionId] = responseQuestion.defaultValue;
    }

    return ret;
  };

  /**
   * Returns the question answer map for the given select question. It will dive
   *  as deep as possible to get all of the possible questionIds that are necessary.
   * @param responseQuestion
   */
  private static getSelectAnswersWithoutParent = (
    selectQuestion: SelectQuestion
  ): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};
    const {
      questionId,
      maxSelections,
      minSelections,
      options,
    } = selectQuestion;

    if (options.length > 0) {
      if (maxSelections == 1) {
        let selectedOption = '';
        options.forEach((option) => {
          if (option.isInitiallySelected) {
            selectedOption = option.optionId;
          }
        });

        if (selectedOption == '') {
          selectedOption = options[0].optionId;
        }

        ret[questionId] = selectedOption;
        // Use the minSelections value to choose right amount of initial values.
      } else if (maxSelections > 1) {
        const selectedOptions: string[] = [];

        const AllOptionIds = options.map((i) => i.optionId);
        options.forEach((option) => {
          option.isInitiallySelected && selectedOptions.push(option.optionId);
        });
        const optionsIdsLeft = difference(AllOptionIds, selectedOptions);

        const initOptions: string[] = [];
        if (minSelections >= selectedOptions.length) {
          initOptions.push(
            ...take(
              [...selectedOptions, ...optionsIdsLeft],
              minSelections - selectedOptions.length
            )
          );
        } else {
          initOptions.push(...take(selectedOptions, minSelections));
        }

        ret[questionId] = initOptions;
      }

      const chosenOptions = ret[questionId];

      if (chosenOptions) {
        // Aggregate the controlledQuestions if they exist
        const controlledQuestionsInit = SDCFormResponseUtility.processControlledOptions(
          selectQuestion,
          chosenOptions
        );

        ret = { ...ret, ...controlledQuestionsInit };
      }
    }

    return ret;
  };

  private static processControlledOptions = (
    selectQuestion: SelectQuestion,
    chosenOptions: SelectQuestionAnswer
  ): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};
    if (Array.isArray(chosenOptions)) {
      const optionQuestions = selectQuestion.options.filter((opt) => {
        return chosenOptions.includes(opt.optionId);
      });

      optionQuestions.forEach((q) => {
        if (q.controlledQuestions) {
          const mapped = q.controlledQuestions.reduce(
            (acc: QuestionAnswersMap, currQuestion) => {
              const data = SDCFormResponseUtility.processQuestion(currQuestion);
              return { ...acc, ...data };
            },
            {}
          );

          ret = { ...ret, ...mapped };
        }
      });
    } else {
      const optionQuestion = selectQuestion.options.find((opt) => {
        return chosenOptions == opt.optionId;
      });

      if (optionQuestion && optionQuestion.controlledQuestions) {
        const mapped = optionQuestion.controlledQuestions.reduce(
          (acc: QuestionAnswersMap, currQuestion) => {
            const data = SDCFormResponseUtility.processQuestion(currQuestion);
            return { ...acc, ...data };
          },
          {}
        );

        ret = { ...ret, ...mapped };
      }
    }

    return ret;
  };

  private static processParentQuestion = (
    question: SDCQuestion
  ): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};
    if (question.isParentQuestion == 'true') {
      const { subQuestions } = question;

      const mapped = subQuestions.reduce(
        (acc: QuestionAnswersMap, currQuestion) => {
          const data = SDCFormResponseUtility.processQuestion(currQuestion);
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...mapped };
    }

    return ret;
  };

  private static processQuestion = (
    question: SDCQuestion
  ): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};

    if (question.isRequired) {
      if (question.type == 'ResponseQuestion') {
        const answersMap = SDCFormResponseUtility.getResponseAnswersWithoutParent(
          question
        );
        ret = { ...ret, ...answersMap };
      } else if (question.type == 'SelectQuestion') {
        const answersMap = SDCFormResponseUtility.getSelectAnswersWithoutParent(
          question
        );

        ret = { ...ret, ...answersMap };
      }

      const processedSubQs = SDCFormResponseUtility.processParentQuestion(
        question
      );

      ret = { ...ret, ...processedSubQs };
    }

    return ret;
  };

  private static processSection = (section: SDCSection): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};

    if (section.questions) {
      const mapped = section.questions.reduce(
        (acc: QuestionAnswersMap, currQuestion) => {
          const data = SDCFormResponseUtility.processQuestion(currQuestion);
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...ret, ...mapped };
    }

    if (section.sections) {
      const mapped = section.sections.reduce(
        (acc: QuestionAnswersMap, currSection) => {
          const data = SDCFormResponseUtility.processSection(currSection);
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...ret, ...mapped };
    }

    return ret;
  };

  private static extractDefaultAnswers = (
    sdcForm: SDCForm
  ): QuestionAnswersMap => {
    let ret: QuestionAnswersMap = {};
    const { body } = sdcForm;

    if (body.questions) {
      const mapped = body.questions.reduce(
        (acc: QuestionAnswersMap, currQuestion) => {
          const data = SDCFormResponseUtility.processQuestion(currQuestion);
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...ret, ...mapped };
    }

    if (body.sections) {
      const mapped = body.sections.reduce(
        (acc: QuestionAnswersMap, currSection) => {
          const data = SDCFormResponseUtility.processSection(currSection);
          return { ...acc, ...data };
        },
        {}
      );

      ret = { ...ret, ...mapped };
    }

    return ret;
  };

  static generateInitialSDCFormResponse(
    sdcForm: SDCForm
  ): Pick<SDCFormResponse, 'SDCFormId' | 'diagnosticProcedureId' | 'answers'> {
    const formProperties = SDCFormResponseUtility.extractSDCFormProperties(
      sdcForm
    );

    const answers = SDCFormResponseUtility.extractDefaultAnswers(sdcForm);

    return {
      ...formProperties,
      answers,
    };
  }
}
