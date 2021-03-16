/* eslint-disable @typescript-eslint/camelcase */
import { date, random as fakerRandom } from 'faker';
import { SDCFormResponseDTO } from '../../infrastructure/sdcFormResponse/SDCFormResponseDto';

import AdrenalDefaultSDCFR from '../fixtures/sdcFormResponse/Adrenal.Bx.Res.129_3.003.001.REL_sdcFDFDefaultSDCFR.json';
import AppendixDefaultSDCFR from '../fixtures/sdcFormResponse/Appendix.Res.135_3.002.001.REL_sdcFDFDefaultSDCFR.json';
import PKG_ACR_CT_STROKEDefaultSDCFR from '../fixtures/sdcFormResponse/PKG_ACR_CT_STROKEDefaultSDCFR.json';
import PKG_Lung_Surgery_CCODefaultSDCFR from '../fixtures/sdcFormResponse/PKG_Lung_Surgery_CCODefaultSDCFR.json';
import PKG_THYROID_USDefaultSDCFR from '../fixtures/sdcFormResponse/PKG_THYROID_USDefaultSDCFR.json';
import forStudentsDefaultSDCFR from '../fixtures/sdcFormResponse/forStudentsDefaultSDCFR.json';

interface Fields {
  formFillerId?: string;
  diagnosticProcedureId?: string;
}
export class SDCFormResponseFactory {
  static createFake({
    formFillerId,
    diagnosticProcedureId,
  }: Fields = {}): SDCFormResponseDTO {
    const randomResponse = fakerRandom.arrayElement([
      AdrenalDefaultSDCFR,
      AppendixDefaultSDCFR,
      PKG_ACR_CT_STROKEDefaultSDCFR,
      PKG_Lung_Surgery_CCODefaultSDCFR,
      PKG_THYROID_USDefaultSDCFR,
    ]);
    const response = JSON.parse(JSON.stringify(randomResponse));

    const formDto: SDCFormResponseDTO = {
      SDCFormId: response.sdcFormId,
      diagnosticProcedureId:
        diagnosticProcedureId || response.diagnosticProcedureId,
      answers: response.answers || {},
      OHIPNumber: fakerRandom.uuid(),
      formFillerId: formFillerId || fakerRandom.uuid(),
      /** ISO Date */
      lastModified: date.between('2018-01-01', new Date()).toISOString(),
    };
    return formDto;
  }

  static createDefaultAnswersFake({
    SDCFormId,
  }: {
    SDCFormId: string;
  }): SDCFormResponseDTO {
    const allFormResponsesList = [
      JSON.parse(JSON.stringify(forStudentsDefaultSDCFR)),
      JSON.parse(JSON.stringify(PKG_Lung_Surgery_CCODefaultSDCFR)),
      JSON.parse(JSON.stringify(PKG_ACR_CT_STROKEDefaultSDCFR)),
      JSON.parse(JSON.stringify(PKG_THYROID_USDefaultSDCFR)),
      JSON.parse(JSON.stringify(AdrenalDefaultSDCFR)),
      JSON.parse(JSON.stringify(AppendixDefaultSDCFR)),
    ] as SDCFormResponseDTO[];
    const requestedDefaultAnswersResponseIndex = allFormResponsesList.findIndex(
      (response) => response.SDCFormId === SDCFormId
    );
    const requestedDefaultAnswersResponse =
      allFormResponsesList[requestedDefaultAnswersResponseIndex];
    return requestedDefaultAnswersResponse;
  }
}
