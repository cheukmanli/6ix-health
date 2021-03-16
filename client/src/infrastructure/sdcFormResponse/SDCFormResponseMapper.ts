import { SDCFormResponse } from '../../domain/sdcFormResponse/SDCFormResponse';
import { SDCFormResponseDTO } from './SDCFormResponseDto';

export default class SDCFormResponseMapper {
  static toDomain({
    SDCFormId,
    OHIPNumber,
    formFillerId,
    diagnosticProcedureId,
    answers,
    lastModified /** ISO Date */,
  }: SDCFormResponseDTO): SDCFormResponse {
    return new SDCFormResponse({
      sdcFormId: SDCFormId,
      OHIPNumber,
      formFillerId,
      diagnosticProcedureId,
      answers,
      lastModified /** ISO Date */,
    });
  }

  static toDTO({
    sdcFormId,
    OHIPNumber,
    formFillerId,
    diagnosticProcedureId,
    answers,
    lastModified /** ISO Date */,
  }: SDCFormResponse): SDCFormResponseDTO {
    return {
      SDCFormId: sdcFormId,
      OHIPNumber,
      formFillerId,
      diagnosticProcedureId,
      answers,
      lastModified /** ISO Date */,
    };
  }
}
