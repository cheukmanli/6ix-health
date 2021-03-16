import { SDCForm } from '../../domain/sdcForm/SDCForm';
import { SDCFormDTO } from './SDCFormDto';

export default class SDCFormMapper {
  static toDomain({
    metadata,
    SDCFormId,
    title,
    version,
    diagnosticProcedureId,
    body,
    footer,
  }: SDCFormDTO): SDCForm {
    return new SDCForm({
      metadata,
      SDCFormId,
      title,
      version,
      diagnosticProcedureId,
      body,
      footer,
    });
  }

  static toDTO({
    metadata,
    SDCFormId,
    title,
    version,
    diagnosticProcedureId,
    body,
    footer,
  }: SDCForm): SDCFormDTO {
    return {
      metadata,
      SDCFormId,
      title,
      version,
      diagnosticProcedureId,
      body,
      footer,
    };
  }
}
