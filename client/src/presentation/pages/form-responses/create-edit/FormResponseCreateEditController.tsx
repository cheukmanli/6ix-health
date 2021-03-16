import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import dayjs from 'dayjs';
import { SDCForm } from '../../../../domain/sdcForm/SDCForm';
import SDCFormBody from './components/SDCFormBody';
import SDCFormFooter from './components/SDCFormFooter';
import SDCFormHeader from './components/SDCFormHeader';
import { getAllPatientsDataArray, getPatients } from '../../../store/patient';
import {
  getAllFormFillersDataArray,
  getFormFillers,
} from '../../../store/formFiller';
import { RootState } from '../../../store/rootReducer';
import SDCFormAssociatedUsersSelector from './components/SDCFormAssociatedUsersSelector';
import { getAllSDCFormsArray } from '../../../store/sdcForm';
import {
  getAllSDCFormResponsesArray,
  getDefaultAnswersForForm,
  submitSDCFormResponse,
} from '../../../store/sdcFormResponse';
import { SDCFormResponse } from '../../../../domain/sdcFormResponse/SDCFormResponse';
import Patient from '../../../../domain/patient/Patient';
import FormFiller from '../../../../domain/formFiller/FormFiller';
import { SelectQuestionAnswer } from '../../../../infrastructure/sdcFormResponse/SDCFormResponseDto';
import SDCValidationResultComponent from './components/SDCValidationResultComponent';

const useStyles = makeStyles({
  container: {
    margin: '0px 8px',
  },
  loadingText: {
    padding: '20px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default (): JSX.Element => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const sdcFormIdOfFormToRender = query.get('SDCFormId') as string;

  const {
    SDCForms,
    patientsData,
    formFillersData,
    SDCFormResponses,
    validateFormResponseResult,
  } = useSelector((state: RootState) => ({
    SDCForms: getAllSDCFormsArray(state),
    patientsData: getAllPatientsDataArray(state),
    formFillersData: getAllFormFillersDataArray(state),
    SDCFormResponses: getAllSDCFormResponsesArray(state),
    validateFormResponseResult:
      state.sdcFormResponse.validateFormResponseResult,
  }));

  const formToRender = SDCForms.find(
    (form) => form.SDCFormId === sdcFormIdOfFormToRender
  ) as SDCForm;

  let sdcFormResponseToSave = SDCFormResponses.find(
    (response) => response.sdcFormId === formToRender.SDCFormId
  ) as SDCFormResponse;

  useEffect(() => {
    const getPatientsAndFormFillers = async () => {
      await dispatch(getPatients());
      await dispatch(getFormFillers());
      await dispatch(getDefaultAnswersForForm(formToRender));
      setIsLoading(false);
    };

    getPatientsAndFormFillers();
  }, [dispatch, formToRender]);

  const handlePatientChange = (patient: Patient) => {
    sdcFormResponseToSave = sdcFormResponseToSave.set(
      'OHIPNumber',
      patient.OHIPNumber
    );
  };

  const handleFormFillerChange = (formFiller: FormFiller) => {
    sdcFormResponseToSave = sdcFormResponseToSave.set(
      'formFillerId',
      formFiller.formFillerId
    );
  };

  const handleQuestionAnswerChange = (
    questionId: string,
    answer: string | string[]
  ) => {
    const updatedAnswers: Record<string, SelectQuestionAnswer> = {
      ...sdcFormResponseToSave.answers,
    };
    updatedAnswers[questionId] = answer;

    sdcFormResponseToSave = sdcFormResponseToSave.set(
      'answers',
      updatedAnswers
    );
  };

  const handleSubmitFormResponse = () => {
    sdcFormResponseToSave = sdcFormResponseToSave.set(
      'lastModified',
      dayjs().toISOString()
    );

    dispatch(submitSDCFormResponse(sdcFormResponseToSave));
  };

  return isLoading ? (
    <div className={classes.loadingText}>
      <CircularProgress size={16} />
      &nbsp;<Typography>Loading...</Typography>
    </div>
  ) : (
    <>
      <SDCFormHeader sdcForm={formToRender} />
      <SDCFormAssociatedUsersSelector
        patients={patientsData}
        formFillers={formFillersData}
        onPatientSelect={handlePatientChange}
        onFormFillerSelect={handleFormFillerChange}
      />
      <SDCFormBody
        onQuestionAnswerChange={handleQuestionAnswerChange}
        body={formToRender.body}
        formResponse={sdcFormResponseToSave}
      />
      <SDCFormFooter sdcFooter={formToRender.footer} />
      {validateFormResponseResult !== null && (
        <SDCValidationResultComponent
          validationResultOrResponse={validateFormResponseResult}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitFormResponse}
      >
        Submit
      </Button>
    </>
  );
};
