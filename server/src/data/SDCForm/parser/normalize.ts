import * as SDC from './types';

import {
  SDCFormMetaData,
  SDCForm,
  SDCSection,
  SDCQuestion,
  SDCSelectOption,
  SelectQuestion,
  SDCFormFooter,
  ResponseQuestion,
  SDCSelectResponseProps,
  SDCSelectChoiceProps,
  ResponseQuestionStringProps,
  ResponseQuestionIntProps,
  ResponseQuestionDateProps,
  ResponseQuestionDecimalProps,
  ParentQuestionProps,
  SDCQuestionProps,
} from '../../../domain/entities/SDCForm';

type ResponseFieldProps = {
  responseSuffix?: string;
  defaultValue: string;
} & (
  | ResponseQuestionStringProps
  | ResponseQuestionIntProps
  | ResponseQuestionDateProps
  | ResponseQuestionDecimalProps
);

export class SDCFormConverter {
  private static extractFormDesignProperties = (
    rawFormDesign: SDC.FormDesign
  ): Partial<SDCFormMetaData> => {
    const { Property } = rawFormDesign,
      properties: Array<
        SDC.PropertyAttributes<SDC.FormDesignPropertyNameType> &
          SDC.SDCBaseType<string>
      > = [];

    if (!Array.isArray(Property)) {
      const attr = Property?.attr;
      attr && properties.push(attr);
    } else {
      const v = Property;
      v.forEach((prop) => {
        const { attr } = prop;
        attr && properties.push(attr);
      });
    }

    const res = properties.reduce(
      (accumulator: Partial<SDCFormMetaData>, property) => {
        if (!property) {
          return accumulator;
        }
        return { ...accumulator, [property.propName]: property.val };
      },
      {}
    );

    return res;
  };

  private static processQuestion = (question: SDC.Question): SDCQuestion => {
    // If Question-response question, processQRQuestion
    let result: SDCQuestion | null = null;

    if (question.ResponseField != null) {
      result = SDCFormConverter.processQRQuestion(question);
    } else {
      result = SDCFormConverter.processMCQuestion(question);
    }

    const questionProps = SDCFormConverter.extractQuestionProps(question);

    return { ...result, ...questionProps };
  };

  private static extractQuestionProps = (
    question: SDC.Question
  ): Omit<SDCQuestionProps, 'isParentQuestion'> => {
    const attr = question?.attr;
    const title = attr?.title || '';

    const isNotRequired =
      (attr?.mustImplement != undefined && attr.mustImplement == false) ||
      title.startsWith('?') ||
      title.startsWith('+');

    return {
      question: title,
      questionId: String(attr?.ID) || '',
      minRepetitions: attr?.minCard || 1,
      maxRepetitions: attr?.maxCard || 1,
      isRequired: !isNotRequired,
    };
  };

  private static extractResponseFieldProps = (
    res?: SDC.SDCResponse | undefined,
    TextAfterResponse?: SDC.TextAfterResponse | undefined,
    ResponseUnits?: SDC.ResponseUnits | undefined
  ): ResponseFieldProps => {
    let defaultValue = '';

    const responseType: SDC.DEType =
      (res &&
        ((res.date && 'date') ||
          (res.decimal && 'decimal') ||
          (res.integer && 'integer') ||
          (res.string && 'string') ||
          'string')) ||
      'string';
    let ret: ResponseFieldProps = { responseType: 'date', defaultValue };

    if (responseType == 'string') {
      const maxMinLengthProps = {
        minLength: res?.string?.attr?.minLength || 0,
        maxLength: res?.string?.attr?.maxLength || 80,
      };

      ret = { ...ret, responseType: 'string', ...maxMinLengthProps };
    } else if (responseType == 'integer') {
      const min = res?.integer?.attr?.minInclusive || 0;
      const max = res?.integer?.attr?.maxInclusive || 0;
      defaultValue = String(min);

      const maxMinIntegerProps = { minIntValue: min, maxIntValue: max };

      ret = {
        ...ret,
        responseType: 'integer',
        ...maxMinIntegerProps,
        defaultValue,
      };
    } else if (responseType == 'date') {
      ret = { defaultValue, responseType: 'date' };
    } else if (responseType == 'decimal') {
      ret = { defaultValue, responseType: 'decimal' };
    }

    const responseSuffix =
      (TextAfterResponse && TextAfterResponse.attr?.val) ||
      (ResponseUnits && ResponseUnits.attr?.val) ||
      '';

    const rs = responseSuffix !== '' ? { responseSuffix } : {};

    return {
      ...rs,
      ...ret,
    };
  };

  /**
   * Process a Question-Response type of question.
   * @param question
   */
  private static processQRQuestion = (
    question: SDC.Question
  ): ResponseQuestion => {
    const attr = question?.attr;
    const title = attr?.title || '';
    const { ResponseField } = question;
    const TextAfterResponse = ResponseField?.TextAfterResponse;
    const ResponseUnits = ResponseField?.ResponseUnits;
    const res = ResponseField?.Response;
    const subQuestions: SDCQuestion[] = [];

    const responseQuestionProps = SDCFormConverter.extractResponseFieldProps(
      res,
      TextAfterResponse,
      ResponseUnits
    );

    if (question.ChildItems) {
      const { Question } = question.ChildItems;

      if (Array.isArray(Question)) {
        const convertedQs = Question.map(SDCFormConverter.processQuestion);
        subQuestions.push(...convertedQs);
      } else {
        Question &&
          subQuestions.push(SDCFormConverter.processQuestion(Question));
      }
    }

    const parentQuestionProps: ParentQuestionProps =
      subQuestions.length > 0
        ? { isParentQuestion: 'true', subQuestions }
        : { isParentQuestion: 'false' };

    const isNotRequired =
      (attr?.mustImplement != undefined && attr.mustImplement == false) ||
      title.startsWith('?') ||
      title.startsWith('+');

    return {
      question: title,
      questionId: String(attr?.ID) || '',
      type: 'ResponseQuestion',
      minRepetitions: attr?.minCard || 1,
      maxRepetitions: attr?.maxCard || 1,
      isRequired: !isNotRequired,

      ...responseQuestionProps,
      ...parentQuestionProps,
    };
  };

  private static processMCQuestion = (
    question: SDC.Question
  ): SelectQuestion => {
    const attr = question.attr;
    const ListField = question.ListField;
    const List = ListField?.List;
    const ListItem = List?.ListItem;
    const options: SDCSelectOption[] = [];
    const subQuestions: SDCQuestion[] = [];
    const title = attr?.title || '';

    if (Array.isArray(ListItem)) {
      options.push(...ListItem.map(SDCFormConverter.processSDCListItem));
    } else {
      ListItem && options.push(SDCFormConverter.processSDCListItem(ListItem));
    }

    if (question.ChildItems) {
      const { Question } = question.ChildItems;

      if (Array.isArray(Question)) {
        const convertedQs = Question.map(SDCFormConverter.processQuestion);
        subQuestions.push(...convertedQs);
      } else {
        Question &&
          subQuestions.push(SDCFormConverter.processQuestion(Question));
      }
    }

    const parentQuestionProps: ParentQuestionProps =
      subQuestions.length > 0
        ? { isParentQuestion: 'true', subQuestions }
        : { isParentQuestion: 'false' };

    const maxSelections =
      typeof ListField?.attr?.maxSelections == 'number'
        ? ListField?.attr?.maxSelections
        : 1;

    const minSelections =
      typeof ListField?.attr?.minSelections == 'number'
        ? ListField?.attr?.minSelections
        : 1;

    const isNotRequired =
      (attr?.mustImplement != undefined && attr.mustImplement == false) ||
      title.startsWith('?') ||
      title.startsWith('+');

    return {
      ...parentQuestionProps,
      question: title,
      questionId: String(attr?.ID) || '',
      options,
      maxSelections,
      minSelections,
      type: 'SelectQuestion',
      minRepetitions: attr?.minCard || 1,
      maxRepetitions: attr?.maxCard || 1,
      isRequired: !isNotRequired,
    };
  };

  private static processSDCListItem = (
    listItem: SDC.ListItem
  ): SDCSelectOption => {
    const { attr, ChildItems, ListItemResponseField } = listItem;
    let responseProps: SDCSelectChoiceProps | SDCSelectResponseProps = {
      responseMode: 'choice',
    };

    const subQuestions: SDCQuestion[] = [];

    if (ListItemResponseField) {
      // Process the ListItemResponseField.

      const {
        Response: res,
        ResponseUnits,
        TextAfterResponse,
      } = ListItemResponseField;

      const responseQuestionProps = SDCFormConverter.extractResponseFieldProps(
        res,
        TextAfterResponse,
        ResponseUnits
      );

      const isRequired =
        ListItemResponseField &&
        typeof ListItemResponseField.attr?.responseRequired == 'boolean'
          ? ListItemResponseField.attr?.responseRequired
          : false;

      responseProps = {
        ...responseQuestionProps,
        responseMode: 'responseText',
        isRequired,
      };
    } else if (ChildItems) {
      // This option enables a control question.
      const { Question } = ChildItems;

      if (Array.isArray(Question)) {
        Question.forEach((q) =>
          subQuestions.push(SDCFormConverter.processQuestion(q))
        );
      } else {
        Question &&
          subQuestions.push(SDCFormConverter.processQuestion(Question));
      }
    } else {
      responseProps = { responseMode: 'choice' };
    }

    const controlQuestions =
      subQuestions.length > 0 ? { controlledQuestions: subQuestions } : {};

    const ret: SDCSelectOption = {
      optionId: String(attr?.ID) || '',
      text: attr?.title || '',
      isInitiallySelected:
        typeof attr?.selected == 'boolean' ? attr.selected : false,
      // responseMode,
      ...controlQuestions,
      ...responseProps,
    };

    return ret;
  };

  /**
   *
   * @param {SDC.ChildItems} childItems appear in the Body, Section, and ListItems.
   */
  private static processBodyChildItem = (
    childItems: SDC.ChildItems
  ): SDCSection => {
    const { Section, Question } = childItems;
    const subSections: SDCSection[] = [];
    const subQuestions: SDCQuestion[] = [];

    if (Section) {
      if (Array.isArray(Section)) {
        subSections.push(...Section.map(SDCFormConverter.processBodySection));
      } else {
        subSections.push(SDCFormConverter.processBodySection(Section));
      }
    }

    if (Question) {
      // Process dangling body questions
      if (Array.isArray(Question)) {
        subQuestions.push(...Question.map(SDCFormConverter.processQuestion));
      } else {
        subQuestions.push(SDCFormConverter.processQuestion(Question));
      }
    }

    const sections = subSections.length > 0 ? { sections: subSections } : {};
    const questions =
      subQuestions.length > 0 ? { questions: subQuestions } : {};

    return {
      minRepetitions: 1,
      maxRepetitions: 1,
      ...sections,
      ...questions,
    };
  };

  private static processBodySection = (section: SDC.Section): SDCSection => {
    const { ChildItems } = section;
    const Section = ChildItems?.Section;
    const Question = ChildItems?.Question;
    const subSections: SDCSection[] = [];
    const subQuestions: SDCQuestion[] = [];
    const title = section.attr?.title || '';

    if (Section) {
      if (Array.isArray(Section)) {
        subSections.push(...Section.map(SDCFormConverter.processBodySection));
      } else {
        subSections.push(SDCFormConverter.processBodySection(Section));
      }
    }

    if (Question) {
      // Process dangling body questions
      if (Array.isArray(Question)) {
        subQuestions.push(...Question.map(SDCFormConverter.processQuestion));
      } else {
        subQuestions.push(SDCFormConverter.processQuestion(Question));
      }
    }

    const sections = subSections.length > 0 ? { sections: subSections } : {};
    const questions =
      subQuestions.length > 0 ? { questions: subQuestions } : {};

    return {
      title,
      minRepetitions: section.attr?.minCard || 1,
      maxRepetitions: section.attr?.maxCard || 1,
      ...sections,
      ...questions,
    };
  };

  private static extractFormProperties = (
    rawFormDesign: SDC.FormDesign
  ): { ID: string; title: string; version: string; lineage: string } => {
    const ID = rawFormDesign.attr?.ID || '',
      formTitle = rawFormDesign.attr?.formTitle || '',
      version = rawFormDesign.attr?.version || '',
      lineage = rawFormDesign.attr?.lineage || '';
    return { ID, title: formTitle, version, lineage };
  };

  private static extractFooterProperties = (
    footer: SDC.Footer
  ): SDCFormFooter => {
    const { Property } = footer,
      properties: Array<SDC.PropertyAttributes & SDC.SDCBaseType<string>> = [];

    if (!Array.isArray(Property)) {
      const attr = Property?.attr;
      attr && properties.push(attr);
    } else {
      const v = Property;
      v.forEach((prop) => {
        const { attr } = prop;
        attr && properties.push(attr);
      });
    }

    const res = properties.reduce(
      (accumulator: Record<string, string>, property) => {
        if (!property) {
          return accumulator;
        }
        return { ...accumulator, [property.propName]: property.val };
      },
      {}
    );

    return res;
  };

  static normalizeRawSDC = (rawFormDesign: SDC.FormDesign): SDCForm => {
    // Now we can extract the information from the rawFormDesign using the Typescript definitions
    // that accurately define the structure of the JSON.

    // Parse the Form's ID, title, etc.
    const {
      ID: SDCFormId,
      title,
      version,
      lineage: diagnosticProcedureId,
    } = SDCFormConverter.extractFormProperties(rawFormDesign);

    // Parse the Properties/metadata of the FormDesign.
    const metadata = SDCFormConverter.extractFormDesignProperties(
      rawFormDesign
    );

    // Parse the rescurive body
    const body = SDCFormConverter.processBodyChildItem(
      rawFormDesign.Body.ChildItems
    );

    // Parse the footer
    const footer = SDCFormConverter.extractFooterProperties(
      rawFormDesign.Footer
    );

    return {
      metadata,
      SDCFormId,
      version,
      title,
      body,
      footer,
      diagnosticProcedureId,
    };
  };
}
