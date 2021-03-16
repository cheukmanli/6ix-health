import SDCForm from 'domain/entities/SDCForm';
import SDCFormResponse from 'domain/entities/SDCFormResponse';
import { SDCFormResponseUtility } from './defaultFormResponseUtility';

/**
 * This will be used to create an initial SDCFormResponse with default answers.
 * @param {SDCForm} sdcForm The SDCForm to create the SDCFormResponse for.
 */
export const generateInitialSDCFormResponse = (
  sdcForm: SDCForm
): Pick<SDCFormResponse, 'SDCFormId' | 'diagnosticProcedureId' | 'answers'> => {
  return SDCFormResponseUtility.generateInitialSDCFormResponse(sdcForm);
};
