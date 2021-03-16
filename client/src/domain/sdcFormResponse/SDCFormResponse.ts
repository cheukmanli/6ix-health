import { Record as immutableRecord } from 'immutable';

interface SDCFormResponseModel {
  sdcFormId: string;
  OHIPNumber: string;
  formFillerId: string;
  diagnosticProcedureId: string;
  answers: QuestionAnswersMap;

  /** ISO Date */
  lastModified: string;
}

export type QuestionAnswersMap =
  /** The value will be an array if there is a repeated question with the same Ids. */
  Record<string, SDCAnswer>;

export type SDCAnswer = ResponseQuestionAnswer | SelectQuestionAnswer;

type ResponseQuestionAnswer = string;

/** This will be an optionId or list of optionIds if a multiselect question or repeated question. */
export type SelectQuestionAnswer = string | string[];

const SDCFormResponseRecord = immutableRecord<SDCFormResponseModel>({
  sdcFormId: '',
  OHIPNumber: '',
  formFillerId: '',
  diagnosticProcedureId: '',
  answers: {},

  /** ISO Date */
  lastModified: '',
});

export class SDCFormResponse extends SDCFormResponseRecord {}
