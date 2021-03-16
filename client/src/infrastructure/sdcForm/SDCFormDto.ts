import {
  SDCFormMetaData,
  SDCSection,
  SDCFormFooter,
} from '../../domain/sdcForm/SDCForm';

export interface SDCFormDTO {
  metadata: Partial<SDCFormMetaData>;
  SDCFormId: string;
  title: string;
  version: string;
  diagnosticProcedureId: string;
  body: SDCSection;
  footer: SDCFormFooter;
}
