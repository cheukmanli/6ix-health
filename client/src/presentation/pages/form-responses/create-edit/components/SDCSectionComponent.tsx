import { AccordionSummary, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { SDCSection } from '../../../../../domain/sdcForm/SDCForm';
import SDCQuestionComponent from './SDCQuestionComponent';
import { SDCFormResponse } from '../../../../../domain/sdcFormResponse/SDCFormResponse';

const useStyles = makeStyles({
  accordionContentContainer: (props: SDCSectionComponentProps) => ({
    padding: `0px ${20 + 4 * props.nestingLevel}px 16px ${
      20 + 4 * props.nestingLevel
    }px`,
  }),
});

interface SDCSectionComponentProps {
  formResponse: SDCFormResponse;
  section: SDCSection;
  nestingLevel: number;
  onQuestionAnswerChange: (
    questionId: string,
    answer: string | string[]
  ) => void;
}

export default function SDCSectionComponent(
  props: SDCSectionComponentProps
): JSX.Element {
  const classes = useStyles(props);
  const { section, nestingLevel, formResponse, onQuestionAnswerChange } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIsExpandedChange = (_: any, newIsExpanded: boolean) =>
    setIsExpanded(newIsExpanded);

  return (
    <Accordion expanded={isExpanded} onChange={handleIsExpandedChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {section.title && <Typography>{section.title}</Typography>}
      </AccordionSummary>
      <div className={classes.accordionContentContainer}>
        {section.questions &&
          section.questions.map((question) => (
            <SDCQuestionComponent
              onQuestionAnswerChange={onQuestionAnswerChange}
              key={JSON.stringify(question)}
              sdcQuestion={question}
              formResponse={formResponse}
            />
          ))}
        {section.sections &&
          section.sections.map((nestedSection) => (
            <SDCSectionComponent
              onQuestionAnswerChange={onQuestionAnswerChange}
              key={JSON.stringify(nestedSection)}
              section={nestedSection}
              formResponse={formResponse}
              nestingLevel={nestingLevel + 1}
            />
          ))}
      </div>
    </Accordion>
  );
}
