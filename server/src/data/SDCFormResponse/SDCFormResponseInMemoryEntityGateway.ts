import { SDCFormResponse } from 'domain/entities/SDCFormResponse';
import {
  ISDCFormResponseEntityGateway,
  CreateSDCFormResponsePayload,
} from 'domain/usecases/SDCFormResponse/ISDCFormResponseEntityGateway';

export class SDCFormResponseInMemoryEntityGateway
  implements ISDCFormResponseEntityGateway {
  #formResponses: SDCFormResponse[];

  constructor() {
    this.#formResponses = [];
  }

  async updateSDCFormResponse(
    SDCFormResponse: SDCFormResponse
  ): Promise<SDCFormResponse | undefined> {
    const index = this.#formResponses.findIndex((f: SDCFormResponse) => {
      return (
        f.SDCFormId === SDCFormResponse.SDCFormId &&
        f.OHIPNumber === SDCFormResponse.OHIPNumber &&
        f.formFillerId === SDCFormResponse.formFillerId
      );
    });
    this.#formResponses[index] = SDCFormResponse;
    return this.#formResponses[index];
  }

  async createSDCFormResponse(
    payload: CreateSDCFormResponsePayload
  ): Promise<SDCFormResponse> {
    const newSDCFormResponse: SDCFormResponse = payload;
    this.#formResponses.push(newSDCFormResponse);
    return newSDCFormResponse;
  }

  async getSDCFormResponses(
    SDCFormId?: string,
    OHIPNumber?: string,
    formFillerId?: string,
    diagnosticProcedureId?: string
  ): Promise<SDCFormResponse[] | undefined> {
    let SDCFormResponses = this.#formResponses;

    if (SDCFormId) {
      SDCFormResponses = SDCFormResponses.filter(
        (f) => f.SDCFormId === SDCFormId
      );
    }
    if (OHIPNumber) {
      SDCFormResponses = SDCFormResponses.filter(
        (f) => f.OHIPNumber === OHIPNumber
      );
    }
    if (formFillerId) {
      SDCFormResponses = SDCFormResponses.filter(
        (f) => f.formFillerId === formFillerId
      );
    }
    if (diagnosticProcedureId) {
      SDCFormResponses = SDCFormResponses.filter(
        (f) => f.diagnosticProcedureId === diagnosticProcedureId
      );
    }

    return SDCFormResponses;
  }
}
