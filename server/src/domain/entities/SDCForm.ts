export interface SDCForm {
  metadata: Partial<SDCFormMetaData>;
  SDCFormId: string;
  title: string;
  version: string;
  diagnosticProcedureId: string;
  body: SDCSection;
  footer: SDCFormFooter;
}
export interface SDCFormMetaData {
  Copyright: string;
  GenericHeaderText: string;
  Category: string;
  OfficialName: string;
  CAP_ProtocolName: string;
  CAP_ProtocolVersion: string;
  TemplateID: string;
  Restrictions: string;
  CAP_Required: boolean;
  AccreditationDate: string;
  WebPostingDate: string;
  ShortName: string;
  ApprovalStatus: number;
  AJCC_Version: string;

  // From dummy SDC Form
  Approval: string;
  CTV_Dkey: string;
  ChecklistCKey: string;
  CurrentFileName: string;
  /** Format: `2017-02-24` */
  EffectiveDate: string;
  Required: boolean;
  VersionID: number;
}

export type SDCFormFooter = Record<string, string>;

export type SDCQuestion = ResponseQuestion | SelectQuestion;

export type SDCQuestionProps = ParentQuestionProps & {
  question: string;
  questionId: string;

  isRequired: boolean;
  /**
   * The minimum number of repetitions allowed for a Question.
   *
   * If 0, then the question and all descendent questions are optional to answer.
   * @default 1
   */
  minRepetitions: number;
  /**
   * The maximum number of repetitions allowed for a Question.
   *
   * If 0, infinitely repeating
   * @default 1
   */
  maxRepetitions: number;
};

/**
 * All questions can be Parent Questions.
 *
 * @note I used "true" or "false" so that Typescript may infer that there are
 *  subQuestions when you do a comparison (if or case statement).
 *
 * A Parent Question is a Question with `subQuestions`. These subQuestions are not
 *  controlled, they are rendered recursively as extra data for this question.
 *
 * For example, please see `PKG_THYROID_US.xml` and observe the `Right Lobe` entry.
 *  It falls under the Section for `1. Thyroid Gland` and the subQuestions exist
 *  in the ChildItems of the `Right Lobe Question`. The subQuestions record the `size`,
 *  etc.
 *
 * Another example can be found in: `Adrenal.Bx.Res.129_3.003.001.REL_sdcFDF.json`
 *  Please search for `No lymph nodes submitted or found` and observe the hierarchy
 *  for the option and its controlledQuestions. Its first controllQuestion is a
 *  ParentQuestion and has `subQuestions` and also options.
 */
export type ParentQuestionProps =
  | {
      isParentQuestion: 'true';
      subQuestions: SDCQuestion[];
    }
  | {
      isParentQuestion: 'false';
    };

/**
 * Represents an open answer Question.
 */
export type ResponseQuestion = SDCQuestionProps & {
  type: 'ResponseQuestion';
  responseSuffix?: string;

  defaultValue: string;
} & (
    | ResponseQuestionStringProps
    | ResponseQuestionIntProps
    | ResponseQuestionDateProps
    | ResponseQuestionDecimalProps
  );

export interface ResponseQuestionIntProps {
  responseType: 'integer';
  /**
   * The maximum integer value for the response.
   * This field only applies to a `responseType` of `integer`
   *
   * If 0, then can be any number >= minIntvalue.
   * @type {SDCResponseQuestionBody} integer
   */
  maxIntValue: number;
  /**
   * The minimum integer value for the response.
   * This field only applies to a `responseType` of `integer`
   * @type {SDCResponseQuestionBody} integer
   */
  minIntValue: number;
}

export interface ResponseQuestionStringProps {
  responseType: 'string';
  /**
   * The minimum length for the response.
   * This field only applies to a `responseType` of `string`
   * @type {SDCResponseQuestionBody} string
   */
  minLength: number;
  /**
   * The maximum length for the response.
   * This field only applies to a `responseType` of `string`
   * @type {SDCResponseQuestionBody} string
   */
  maxLength: number;
}

export interface ResponseQuestionDecimalProps {
  responseType: 'decimal';
}

export interface ResponseQuestionDateProps {
  responseType: 'date';
}

export type SelectQuestion = SDCQuestionProps & {
  type: 'SelectQuestion';
  /**
   * If 0, unlimited
   * if 1, single select
   * if > 1, max selections is finite but not 1.
   */
  maxSelections: number;
  /**
   * Minimum amount of selections for this select question.
   * Minimum value is 1. Only applicable when maxSelections is not 0.
   */
  minSelections: number;
  /**
   * There may be 0 options. In the case of 0 options, there may actually
   *  be `subQuestions` as part of the Question.
   *
   * If there are 0 options, render nothing for the options and render the subQuestions
   *  if they exist.
   *
   * An example of 0 can be found in: `PKG_THYROID_US.json`. Search for "Right Lobe"
   *  in the document and notice that there are 0 options but there are still subQuestions
   *  to render.
   */
  options: SDCSelectOption[];
};

export type SDCSelectOption = {
  optionId: string;
  text: string;
  isInitiallySelected: boolean;

  /**
   * These can be populated if the question is a control question.
   */
  controlledQuestions?: SDCQuestion[];
} & (SDCSelectChoiceProps | SDCSelectResponseProps);

export interface SDCSelectChoiceProps {
  responseMode: 'choice';
}

export interface SDCSelectResponseProps {
  responseMode: 'responseText';
  responseType: SDCResponseQuestionBody;
  /** Whether the text in this response choice is required. */
  isRequired: boolean;
  responseSuffix?: string;
}

export interface SDCSection {
  title?: string;
  questions?: SDCQuestion[];
  sections?: SDCSection[];
  /**
   * The minimum number of repetitions allowed for a Section.
   *
   * If 0, then the section and all descendent questions are optional to answer.
   * @default 1
   */
  minRepetitions: number;
  /**
   * The maximum number of repetitions allowed for a Section.
   *
   * If 0, infinitely repeating
   * @default 1
   */
  maxRepetitions: number;
}

export type SDCResponseQuestionBody = 'date' | 'string' | 'decimal' | 'integer';

export default SDCForm;
